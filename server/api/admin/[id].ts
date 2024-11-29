import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Access the params from the dynamic route
  const params = event.context.params as Record<string, string> | undefined;
  const id = params?.id; // Safely extract the ID

  try {
    if (id) {
      // Fetch a single admin by ID
      const singleAdmin = await prisma.admin.findUnique({
        where: { id },
      });

      if (!singleAdmin) {
        return {
          success: false,
          error: `No admin found with ID: ${id}`,
        };
      }

      return {
        success: true,
        data: singleAdmin,
      };
    } else {
      // Fetch all admins if no ID is provided
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
