import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Access the dynamic route parameters
  const params = event.context.params as Record<string, string> | undefined;
  const id = params?.id; // Safely extract the ID

  try {
    if (id) {
      // Fetch a single event by ID with relations (admin and signUps)
      const singleEvent = await prisma.event.findUnique({
        where: { id },
        include: { User: true, SignUps: true },
      });

      if (!singleEvent) {
        return {
          success: false,
          error: `No event found with ID: ${id}`,
        };
      }

      return {
        success: true,
        data: singleEvent,
      };
    } else {
      // Fetch all events with relations (admin and signUps)
      const allEvents = await prisma.event.findMany({
        include: { User: true, SignUps: true },
      });

      return {
        success: true,
        data: allEvents,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching events: ${errorMessage}`,
    };
  }
});
