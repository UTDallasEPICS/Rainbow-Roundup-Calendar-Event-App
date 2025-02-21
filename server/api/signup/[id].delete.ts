import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Access the dynamic route parameters to get the signup ID
  const params = event.context.params as Record<string, string> | undefined;
  const id = params?.id; // Extract the ID from the dynamic route

  if (!id) {
    return {
      success: false,
      error: 'Signup ID is required.',
    };
  }

  try {
    // Delete the signup by ID
    const deletedSignUp = await prisma.signUp.delete({
      where: { id }, // Use the ID from the URL
    });

    return {
      success: true,
      message: 'Successfully unregistered from the event',
      data: deletedSignUp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error deleting signup: ${errorMessage}`,
    };
  }
});
