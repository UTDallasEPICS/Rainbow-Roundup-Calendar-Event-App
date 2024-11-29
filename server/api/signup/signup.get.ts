import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Assuming you want to get a list of all signups
    const signups = await event.context.prisma.signUp.findMany();  // Adjust this if needed to fetch specific data

    return {
      success: true,
      data: signups,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching signups: ${errorMessage}`,
    };
  }
});
