import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const params = event.context.params as Record<string, string> | undefined;
  const { id } = params || {}; // Safely extract the ID from params

  // Debugging: Log the params to verify the URL structure
  console.log('Params:', params); 

  if (!id) {
    return {
      success: false,
      error: 'User ID is required to update the user.',
    };
  }

  console.log('hello');

  const body = await readBody(event);
  console.log("Received data to update:", body); // Debugging: Log the body to ensure it is correctly received

  try {
    // Fetch the existing user before updating
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        error: `User with ID ${id} not found.`,
      };
    }

    console.log("Existing user before update:", existingUser); // Debugging: Log the existing user data

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: body.email,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
        phoneNum: body.phoneNum || null,
        profilePic: body.profilePic || null,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating user: ${errorMessage}`,
    };
  }
});
