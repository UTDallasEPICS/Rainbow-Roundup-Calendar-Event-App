import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: body.id },
      data: {
        description: body.description,
        adminId: body.adminId,
        date: new Date(body.date),
        location: body.location,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        timezone: body.timezone,
        capacity: body.capacity,
      },
    });

    return {
      success: true,
      data: updatedEvent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating event: ${errorMessage}`,
    };
  }
});
