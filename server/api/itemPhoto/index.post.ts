import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { auth } from "~/server/auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user as User | undefined;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  if (user.role !== "SUPER" && user.role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only admins can upload merchandise images",
    });
  }

  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({ statusCode: 400, statusMessage: "No form data" });
  }

  const fileParts = form.filter((part) => part.filename !== undefined);
  const file = fileParts.find((part) => part.name === "file");
  if (fileParts.length !== 1 || !file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Upload exactly one image using the "file" field',
    });
  }

  const itemId = form.find((part) => part.name === "itemId")?.data.toString();
  if (!itemId) {
    throw createError({ statusCode: 400, statusMessage: "Item ID is required" });
  }

  const item = await event.context.prisma.abstractItem.findUnique({
    where: { id: itemId },
    select: { id: true },
  });
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: "Item not found" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxFileSize = 5 * 1024 * 1024;
  if (!file.data.length) {
    throw createError({ statusCode: 400, statusMessage: "Uploaded image is empty" });
  }
  if (file.data.length > maxFileSize) {
    throw createError({ statusCode: 400, statusMessage: "File too large. Maximum size is 5 MB." });
  }
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `File type ${file.type || "unknown"} not allowed`,
    });
  }

  const config = useRuntimeConfig();
  const configuredUploadPath: unknown = config.public.uploadStoragePath;
  const uploadRoot =
    typeof configuredUploadPath === "string" && configuredUploadPath.trim()
      ? configuredUploadPath
      : " ";
  const imageId = randomUUID();
  const fileDir = path.resolve(uploadRoot, "users", user.id, "images");
  const filePath = path.join(fileDir, imageId);
  const fileUrl = `/api/itemPhoto/${encodeURIComponent(user.id)}/${imageId}`;

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, file.data, { flag: "wx" });

  try {
    const itemPhoto = await event.context.prisma.itemPhoto.create({
      data: {
        id: imageId,
        url: fileUrl,
        itemId,
      },
    });
    setResponseStatus(event, 201);
    return { data: itemPhoto };
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Failed to remove merchandise image after database error:", cleanupError);
    }
    throw error;
  }
});
