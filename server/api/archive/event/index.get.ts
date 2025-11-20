// gets **ARCHIVED** events

import { PrismaClient } from "@prisma/client";
import { auth } from "~/server/auth"
import type { User } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;

  try {
    const session = await auth.api.getSession({
          headers:  event.headers
    })
    const user = session?.user as User | undefined;
    
    if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
        throw createError({
        statusCode: 403,
        statusMessage: "Unauthenticated",
        });
    }

    const events = await prisma.event.findMany({
      where: {
        isArchived: true
      },
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
