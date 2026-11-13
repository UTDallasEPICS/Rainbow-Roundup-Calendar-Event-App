import { auth } from "~/server/auth";
import fs from "node:fs/promises";
import path from "node:path";
import {
  createError,
  defineEventHandler,
  getRouterParam,
  setResponseStatus,
} from "h3";
import type { User } from "~/types/session";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user as User | undefined;
  if (!user || (user.role !== "SUPER" && user.role !== "ADMIN")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only admins can delete merchandise images",
    });
  }

  const imageId = getRouterParam(event, "id");
  if (!imageId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image ID is required",
    });
  }

  const prisma = event.context.prisma;
  const itemPhoto = await prisma.itemPhoto.findUnique({
    where: { id: imageId },
  });
  if (!itemPhoto) {
    throw createError({
      statusCode: 404,
      statusMessage: "Merchandise image not found",
    });
  }

  const imageUrlMatch = itemPhoto.url.match(
    /^\/api\/itemPhoto\/([^/]+)\/([\da-f-]{36})$/,
  );
  const encodedUserId = imageUrlMatch?.[1];
  if (!encodedUserId || imageUrlMatch?.[2] !== itemPhoto.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid merchandise image URL",
    });
  }

  let userId: string;
  try {
    userId = decodeURIComponent(encodedUserId);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid merchandise image URL",
    });
  }
  if (encodeURIComponent(userId) !== encodedUserId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid merchandise image URL",
    });
  }

  const config = useRuntimeConfig();
  const configuredUploadPath: unknown = config.public.uploadStoragePath;
  const uploadRoot =
    typeof configuredUploadPath === "string" && configuredUploadPath.trim()
      ? configuredUploadPath
      : " ";
  const usersRoot = path.resolve(uploadRoot, "users") + path.sep;
  const filePath = path.resolve(
    uploadRoot,
    "users",
    userId,
    "images",
    itemPhoto.id,
  );
  if (!filePath.startsWith(usersRoot)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid merchandise image URL",
    });
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Failed to remove merchandise image file:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not delete merchandise image file",
      });
    }
  }

  const deletedImage = await prisma.itemPhoto.delete({
    where: { id: imageId },
  });

  setResponseStatus(event, 200);
  return { data: deletedImage };
});
