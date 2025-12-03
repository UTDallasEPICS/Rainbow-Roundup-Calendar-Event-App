import { PrismaClient } from '@prisma/client';
import { getServerSession } from "#auth";
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  // Debugging: Log the params to verify the URL structure
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'User ID is required to update the user.',
    };
  }

  const body = await readBody(event);

  try {
    const session = await getServerSession(event);
    const user = session?.user as User | undefined;

    if (!user || (!["SUPER", "ADMIN"].includes(user.role) && user.id !== id)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unauthenticated",
      });
    }

    // Fetch the existing user before updating
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      setResponseStatus(event, 404)
      return {
        success: false,
        error: `User with ID ${id} not found.`,
      };
    }

    const updateData: any = {};
<<<<<<< HEAD
    if (body.email) updateData.email = body.email;
    if (body.firstname) updateData.firstname = body.firstname;
    if (body.lastname) updateData.lastname = body.lastname;
    if (body.phoneNum) updateData.phoneNum = body.phoneNum;
    if (body.profilePic) updateData.profilePic = body.profilePic;
    if (body.GlobalNotif != null) updateData.GlobalNotif = body.GlobalNotif;
    if (body.role) updateData.role = body.role;
    if (body.isBanned != null) {updateData.isBanned = body.isBanned}

=======
    if(body.email) 
      updateData.email = body.email
    if(body.firstname) 
      updateData.firstname = body.firstname
    if(body.lastname) 
      updateData.lastname = body.lastname
    if(body.phoneNum) 
      updateData.phoneNum = body.phoneNum
    if(body.profilePic)
      updateData.profilePic = body.profilePic
    if(body.emailNotif != null) // This is a boolean, so a plain if statement won't work
      updateData.emailNotif = body.emailNotif
      if(body.nativeNotif != null) // This is a boolean, so a plain if statement won't work
      updateData.nativeNotif = body.nativeNotif
>>>>>>> origin/main
    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });
    setResponseStatus(event, 200)
    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating user: ${errorMessage}`,
    };
  }
});
