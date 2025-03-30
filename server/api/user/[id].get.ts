import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const params = event.context.params as Record<string, string> | undefined; // Type cast to ensure correct type
  const id = params?.id; // Safely access the ID

  try {
    if (id) {
      // Fetch a single user by ID
      const singleUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!singleUser) {
        return {
          success: false,
          error: `No user found with ID: ${id}`,
        };
      }

      return {
        success: true,
        data: singleUser,
      };
    } else {
      // Fetch all users if no ID is provided
      const allUsers = await prisma.user.findMany();

      return {
        success: true,
        data: allUsers,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching user(s): ${errorMessage}`,
    };
  }
});