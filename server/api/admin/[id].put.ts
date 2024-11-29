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
      error: 'Admin ID is required to update the admin.',
    };
  }

  console.log('hello');

  const body = await readBody(event);
  console.log("Received data to update:", body); // Debugging: Log the body to ensure it is correctly received

  try {
    // Fetch the existing admin before updating
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return {
        success: false,
        error: `Admin with ID ${id} not found.`,
      };
    }

    console.log("Existing admin before update:", existingAdmin); // Debugging: Log the existing admin data

    // Perform the update
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        email: body.email,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
      },
    });

    return {
      success: true,
      data: updatedAdmin,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating admin: ${errorMessage}`,
    };
  }
});
