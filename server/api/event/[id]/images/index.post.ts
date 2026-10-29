import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  createError,
  defineEventHandler,
  getRouterParam,
  readMultipartFormData,
  setResponseStatus,
} from "h3";
import type { User } from "~/types/session";
import { auth } from "~/server/auth";

const UPLOAD_DIRECTORY = "events";

export default defineEventHandler(async (event) => {
  // Get the authenticated Better Auth session.
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user as User | undefined;

  if(!session){
    throw createError({
      statusCode: 401,
      statusMessage: "User is not authenticated",
    });
  }

  // Only admins and super admins can upload event images.
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only admins can upload event images",
    });
  }

  // Get the event ID from the route and confirm that it exists.
  const eventId = getRouterParam(event, "id");
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID is required",
    });
  }

  const prisma = event.context.prisma;
  const eventRecord = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });

  if (!eventRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found",
    });
  }

  // Read  form data and find the uploaded file.
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: "No form data provided",
    });
  }

  const fileParts = formData.filter((part) => part.filename !== undefined);
  const file = fileParts.find((part) => part.name === "file");
  if (fileParts.length !== 1 || !file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Upload exactly one image using the "file" field',
    });
  }

  if (!file.data.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Uploaded image is empty",
    });
  }

  // Store images in the configured upload directory, grouped under "events".
  const config = useRuntimeConfig();
  const uploadDirectory = path.resolve(
    config.UPLOAD_DIR || "public/uploads",
    UPLOAD_DIRECTORY,
  );
  const imageId = randomUUID();
  const filePath = path.join(uploadDirectory, imageId);
  const imageUrl = `/api/event/${encodeURIComponent(eventId)}/images/${imageId}`;

  await fs.mkdir(uploadDirectory, { recursive: true });

  // Write with "wx" so an existing file cannot be overwritten.
  await fs.writeFile(filePath, file.data, { flag: "wx" });

  // Save the image record after the file exists; remove the file if the DB write fails.
  try {
    const image = await prisma.eventImage.create({
      data: {
        id: imageId,
        eventId,
        url: imageUrl,
      },
    });

    setResponseStatus(event, 201);
    return { data: image };
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Failed to remove event image after database error:", cleanupError);
    }
    throw error;
  }
});
