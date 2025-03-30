import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Access the dynamic route parameters
  const params = event.context.params as Record<string, string> | undefined;
  const id = params?.id; // Safely extract the ID

  try {
    if (id) {
      // Fetch a single signup by ID with relations if needed (e.g., Event or User)
      const singleSignup = await prisma.signUp.findUnique({
        where: { id },
        include: { event: true, user: true }, // Include relations like event and user
      });

      if (!singleSignup) {
        return {
          success: false,
          error: `No signup found with ID: ${id}`,
        };
      }

      return {
        success: true,
        data: singleSignup,
      };
    } else {
      // Fetch all signups with relations (e.g., event and user)
      const allSignups = await prisma.signUp.findMany({
        include: { event: true, user: true }, // Include relations like event and user
      });

      return {
        success: true,
        data: allSignups,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching signups: ${errorMessage}`,
    };
  }
});
