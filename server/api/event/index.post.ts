import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { getServerSession } from "#auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;
  const session = await getServerSession(event);
  const user = session?.user as User | undefined;

  if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const currentTime = new Date();

  // Check that event starts before it ends
  if (startTime >= endTime) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "EndTime must be after StartTime",
    };
  }

  // Check that start date is not in the past
  if (startTime < currentTime) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "Event start time cannot be in the past",
    };
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        id: body.id,
        description: body?.description,
        userId: body.userId,
        eventLat: body.eventLat,
        eventLong: body.eventLong,
        startTime: startTime,
        endTime: endTime,
        capacity: body.capacity,
        currentCapacity: 0,
      },
    });

    setResponseStatus(event, 200);
    return {
      data: newEvent,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setResponseStatus(event, 500);
    return {
      success: false,
      error: `Error creating event: ${errorMessage}`,
    };
  }
});