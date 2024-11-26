import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    await prisma.admin.delete({
      where: { id: String(id) },
    });

    return {
      success: true,
      message: 'Admin deleted successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error deleting admin: ${errorMessage}`,
    };
  }
});
