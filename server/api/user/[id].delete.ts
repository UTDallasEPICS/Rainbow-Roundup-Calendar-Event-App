import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const params = event.context.params as Record<string, string> | undefined;
  const { id } = params || {}; // Extract id from URL params

  if (!id) {
    return {
      success: false,
      error: 'User ID is required to delete the user.',
    };
  }

  try {
    // Attempt to delete the user from the database
    await prisma.user.delete({
      where: { id: String(id) },
    });

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error deleting user: ${errorMessage}`,
    };
  }
});
