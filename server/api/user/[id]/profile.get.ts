import fs from "node:fs";
import path from "node:path";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const userID = getRouterParam(event, "id");

  if (!userID) {
    throw createError({ statusCode: 400, statusMessage: "Missing eventID" });
  }

  // Get file path relative to project root
  const filePath = path.join(config.uploadDir || "uploads", userID, "profile");

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  //this may need to be checked
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
      statusMessage: "Stored profile picture has an unsupported format",
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
