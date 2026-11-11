import fs from "node:fs";
import path from "node:path";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");
  const imageId = getRouterParam(event, "imageId");
  if (!userId || !imageId || !/^[\da-f-]{36}$/i.test(imageId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID and valid image ID are required",
    });
  }

  const imageUrl = `/api/itemPhoto/${encodeURIComponent(userId)}/${imageId}`;
  const image = await event.context.prisma.itemPhoto.findUnique({
    where: { id: imageId },
    select: { url: true },
  });
  if (!image || image.url !== imageUrl) {
    throw createError({ statusCode: 404, statusMessage: "Merchandise image not found" });
  }

  const config = useRuntimeConfig();
  const configuredUploadPath: unknown = config.public.uploadStoragePath;
  const uploadRoot =
    typeof configuredUploadPath === "string" && configuredUploadPath.trim()
      ? configuredUploadPath
      : "public/images";
  const filePath = path.resolve(uploadRoot, "users", userId, "images", imageId);
  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "Merchandise image file not found" });
  }

  const header = Buffer.alloc(12);
  const fileDescriptor = fs.openSync(filePath, "r");
  let bytesRead: number;
  try {
    bytesRead = fs.readSync(fileDescriptor, header, 0, header.length, 0);
  } finally {
    fs.closeSync(fileDescriptor);
  }

  //check file type
  const isPng =
    bytesRead >= 8 &&
    header
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg =
    bytesRead >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff;
  const isWebp =
    bytesRead >= 12 &&
    header.toString("ascii", 0, 4) === "RIFF" &&
    header.toString("ascii", 8, 12) === "WEBP";
  const isGif =
    bytesRead >= 6 &&
    ["GIF87a", "GIF89a"].includes(header.toString("ascii", 0, 6));

  if (!isPng && !isJpeg && !isWebp && !isGif) {
    throw createError({
      statusCode: 415,
      statusMessage: "Stored merchandise image has an unsupported format",
    });
  }

  const contentType = isPng
    ? "image/png"
    : isJpeg
      ? "image/jpeg"
      : isWebp
        ? "image/webp"
        : "image/gif";
  setHeader(event, "Content-Type", contentType);
  return sendStream(event, fs.createReadStream(filePath));
});
