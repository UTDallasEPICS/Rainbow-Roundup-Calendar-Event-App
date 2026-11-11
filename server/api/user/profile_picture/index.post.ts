import { auth } from "~/server/auth";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    setResponseStatus(event, 400);
    return { error: `Please login` };
  }
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const form = await readMultipartFormData(event);
  const file = form?.find((x) => x.name === "file");
  const fileDir = path.resolve(
    config.uploadStoragePath || " ", //typescript won't accept the env variable alone
    "profiles",
    session.user.id,
  );

  if (!file) return (setResponseStatus(event, 400), { error: "No file" });
  if (!file.data?.length)
    return (setResponseStatus(event, 400), { error: "Empty upload" });
  if (file.data.length > MAX_FILE_SIZE)
    return (setResponseStatus(event, 400), { error: "File too big" });
  if (!file.type || !allowedTypes.includes(file.type)) {
    setResponseStatus(event, 400);
    return { error: `File type ${file.type || "unknown"} not allowed` };
  }

  const existingUser = await event.context.prisma.user.findUnique({
    where: { id: session.user.id },
    select: { profilePic: true },
  });
  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  const imageId = randomUUID();
  const filePath = path.join(fileDir, imageId);
  const fileUrl = `/api/user/${encodeURIComponent(session.user.id)}/profile/${imageId}`;

  await fs.mkdir(fileDir, { recursive: true });
  await fs.writeFile(filePath, file.data, { flag: "wx" });

  try {
    await event.context.prisma.user.update({
      where: { id: session.user.id },
      data: { profilePic: fileUrl },
    });
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Failed to restore profile picture after database error:", cleanupError);
    }
    throw error;
  }

  const profileUrlPrefix = `/api/user/${encodeURIComponent(session.user.id)}/profile/`;
  const previousImageId = existingUser.profilePic.startsWith(profileUrlPrefix)
    ? existingUser.profilePic.slice(profileUrlPrefix.length)
    : null;
  const previousFilePath =
    previousImageId && /^[\da-f-]{36}$/i.test(previousImageId)
      ? path.join(fileDir, previousImageId)
      : existingUser.profilePic ===
          `/api/user/${encodeURIComponent(session.user.id)}/profile`
        ? path.join(fileDir, "profile")
        : null;

  if (previousFilePath) {
    try {
      await fs.unlink(previousFilePath);
    } catch (cleanupError) {
      if ((cleanupError as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("Failed to remove replaced profile picture:", cleanupError);
      }
    }
  }

  setResponseStatus(event, 201);
  return {
    fileUrl,
  };
});
