import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma as PrismaClient;
  const query = getQuery(event);
  const userId = query.userId as string;
  const eventId = query.eventId as string;

  try {
    if (!userId || !eventId) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: "Missing userId or eventId in query parameters",
      };
    }

    const signUp = await prisma.signUp.findUnique({
      where: {
        userId_eventId: { userId, eventId }, // compound key from schema
      },
      include: {
        User: true,
        Event: true,
      },
    });

    if (!signUp) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `No signup found for userId=${userId} and eventId=${eventId}`,
      };
    }

    setResponseStatus(event, 200);
    console.log("HERE");
    console.log(signUp);
    return {
      success: true,
      signUp,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Failed to fetch signup: ${message}`,
    };
  }
});
