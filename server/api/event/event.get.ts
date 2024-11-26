import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    if (id) {
      // Get a single event by ID
      const singleEvent = await prisma.event.findUnique({
        where: { id: String(id) },
        include: { admin: true, signUps: true },
      });

      return {
        success: true,
        data: singleEvent,
      };
    } else {
      // Get all events
      const allEvents = await prisma.event.findMany({
        include: { admin: true, signUps: true },
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
