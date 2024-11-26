import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    if (id) {
      // Fetch a single admin by ID
      const singleAdmin = await prisma.admin.findUnique({
        where: { id: String(id) },
      });

      return {
        success: true,
        data: singleAdmin,
      };
    } else {
      // Fetch all admins
      const allAdmins = await prisma.admin.findMany();

      return {
        success: true,
        data: allAdmins,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching admin(s): ${errorMessage}`,
    };
  }
});
