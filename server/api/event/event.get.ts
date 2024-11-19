import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { eventId } = event.context.params!;
    const eventDetails = await event.context.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!eventDetails) {
      throw new Error("Event not found");
    }

    return eventDetails;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to retrieve event details");
  }
});
