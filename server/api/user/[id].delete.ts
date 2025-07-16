import { EventImpl } from "@fullcalendar/core/internal.js";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");
  const session = await getServerSession(event);

  const user = session?.user as User | undefined;
  
  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "User ID is required to delete the user.",
    };
  }

  // Allow deletion if user is SUPER, ADMIN, or is deleting their own account
  if (!user || (!["SUPER", "ADMIN"].includes(user.role) && user.id !== id)) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: "No user with matching id",
      };
    }
    //cascade deletes
    await prisma.announcement.deleteMany({ where: { userId: id } });
    await prisma.signUp.deleteMany({ where: { userId: id } });
    await prisma.event.deleteMany({ where: { userId: id } });
    await prisma.report.deleteMany({ where: { reporterUserId: id } });
    await prisma.report.deleteMany({ where: { reportedUserId: id } });
    // Attempt to delete the user from the database
    await prisma.user.delete({
      where: { id: String(id) },
    });
    setResponseStatus(event, 200);
    return {
      success: true,
      message: "User deleted successfully",
      user: existingUser,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setResponseStatus(event, 500);
    return {
      success: false,
      error: `Error deleting user: ${errorMessage}`,
    };
  }
});
