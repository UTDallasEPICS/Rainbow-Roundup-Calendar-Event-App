import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    if (id) {
      // Fetch a single user by ID
      const singleUser = await prisma.user.findUnique({
        where: { id: String(id) },
      });

      return {
        success: true,
        data: singleUser,
      };
    } else {
      // Fetch all users
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

