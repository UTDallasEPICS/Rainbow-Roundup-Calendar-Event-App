import fs from "node:fs/promises";
import path from "node:path";
import {
  createError,
  defineEventHandler,
  getRouterParam,
  setResponseStatus,
} from "h3";
import type { User } from "~/types/session";
import { auth } from "~/server/auth";

const UPLOAD_DIRECTORY = "events";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user as User | undefined;

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only admins can delete event images",
    });
  }

  const eventId = getRouterParam(event, "id");
  const imageId = getRouterParam(event, "imageId");
  if (!eventId || !imageId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event ID and image ID are required",
    });
  }

  const prisma = event.context.prisma;
  const image = await prisma.eventImage.findFirst({
    where: { id: imageId, eventId },
  });

  if (!image) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event image not found",
    });
  }

  const config = useRuntimeConfig();
  const uploadDirectory = path.resolve(
    config.UPLOAD_DIR || "public/uploads",
    UPLOAD_DIRECTORY,
  );
  const filePath = path.join(uploadDirectory, image.id);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Failed to remove event image file:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not delete the event image file",
      });
    }
  }

  const deletedImage = await prisma.eventImage.delete({
    where: { id: image.id },
  });

  setResponseStatus(event, 200);
  return { data: deletedImage };
});
