import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;

  try {
    const events = await prisma.event.findMany({
      include: {
        User: true, // Event creator
        SignUps: {
          include: {
            User: { select: { id: true, firstname: true, profilePic: true } },
          },
        }, // Who signed up
      },
      orderBy: {
        startTime: "asc", // Optional: sort upcoming events first
      },
    });

    return events;
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error fetching events: ${errorMessage}`,
    };
  }
});
