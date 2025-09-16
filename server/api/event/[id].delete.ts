import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";
import { getServerSession } from "#auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");
  const session = await getServerSession(event);

  const user = session?.user as User | undefined;

  if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "Event ID is required.",
    };
  }

  try {
    // First check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `No event found with ID: ${id}`,
      };
    }

    await prisma.signUp.deleteMany({ where: { eventId: id } });


    // TODO: Set up deletion in the Google Events Calendar as well as deleting from the Prisma Database
    await prisma.event.delete({
      where: { id },
    });
    setResponseStatus(event, 200);
    return {
      success: true,
      message: "Event deleted successfully",
      event: existingEvent,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error deleting event: ${errorMessage}`,
    };
  }
});
