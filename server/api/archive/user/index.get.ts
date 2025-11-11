import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";
import type { User } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;

  try {
    const session = await getServerSession(event);
    const user = session?.user as User | undefined;
    
    if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
        throw createError({
        statusCode: 403,
        statusMessage: "Unauthenticated",
        });
    }
    
    const users = await prisma.user.findMany({
      where: {
        isBanned: true
      },
      include: {
        CreatedEvents: true,
        SignUps: true,
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
