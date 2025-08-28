import { PrismaClient } from "@prisma/client";
import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;

  try {
    const users = await prisma.user.findMany({
      include: {
        CreatedEvents: true,
        SignUps: true,
        Announcements: true,
        Reports: true,
        PotentialOffenses: true,
      },
    });

    setResponseStatus(event, 200);
    return {
      success: true,
      Users: users,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error fetching users: ${errorMessage}`,
    };
  }
});
