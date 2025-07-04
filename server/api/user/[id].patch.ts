import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";
import { getServerSession } from "#auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  // Debugging: Log the params to verify the URL structure
  const id = getRouterParam(event, "id");
  const session = await getServerSession(event);
  const user = session?.user as User | undefined;
  
  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "User ID is required to update the user.",
    };
  }
  
  if (!user || user.id !== id) {
    throw createError({
      statusMessage: "Forbidden: Only account holder can access this file.",
      statusCode: 403,
    });
  }

  const body = await readBody(event);

  try {
    // Fetch the existing user before updating
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `User with ID ${id} not found.`,
      };
    }

    const updateData: any = {};
    if (body.email) updateData.email = body.email;
    if (body.firstname) updateData.firstname = body.firstname;
    if (body.lastname) updateData.lastname = body.lastname;
    if (body.phoneNum) updateData.phoneNum = body.phoneNum;
    if (body.profilePic) updateData.profilePic = body.profilePic;
    if (body.GlobalNotif) updateData.GlobalNotif = body.GlobalNotif;
    if (body.role) updateData.role = body.role;
    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    setResponseStatus(event, 200);
    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error updating user: ${errorMessage}`,
    };
  }
});
