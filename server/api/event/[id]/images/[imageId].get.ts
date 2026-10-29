import fs from "node:fs";
import path from "node:path";
import {
  createError,
  defineEventHandler,
  getRouterParam,
  sendStream,
  setHeader,
} from "h3";

const UPLOAD_DIRECTORY = "events";

export default defineEventHandler(async (event) => {
  // Get event and image IDs from the route.
  const eventId = getRouterParam(event, "id");
  const imageId = getRouterParam(event, "imageId");
  if (!eventId || !imageId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID and image ID are required",
    });
  }

  // Find only an image record belonging to the requested event.
  const image = await event.context.prisma.eventImage.findFirst({
    where: { id: imageId, eventId },
    select: { id: true },
  });

  if (!image) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event image not found",
    });
  }

  // Construct the file path from the trusted image ID and configured storage directory.
  const config = useRuntimeConfig();
  const uploadDirectory = path.resolve(
    config.UPLOAD_DIR || "public/uploads",
    UPLOAD_DIRECTORY,
  );
  const filePath = path.join(uploadDirectory, image.id);

  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event image file not found",
    });
  }

  // Detect the stored format because uploaded files are saved without extensions.
  const header = Buffer.alloc(12);
  const fileDescriptor = fs.openSync(filePath, "r");
  let bytesRead: number;
  try {
    bytesRead = fs.readSync(fileDescriptor, header, 0, header.length, 0);
  } finally {
    fs.closeSync(fileDescriptor);
  }

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
      statusMessage: "Stored event image has an unsupported format",
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
