import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { eventId } = event.context.params!;
    const body = await readBody(event);

    const updatedEvent = await event.context.prisma.event.update({
      where: { id: eventId },
      data: {
        description: body.description,
        date: new Date(body.date),
        location: body.location,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        timezone: body.timezone,
        capacity: body.capacity,
      },
    });

    return updatedEvent;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to update event");
  }
});
