import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const newEvent = await prisma.event.create({
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
      data: newEvent,
    };
  } catch (error) {
    // Use a type guard to ensure `error` is an instance of `Error`
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error creating event: ${errorMessage}`,
    };
  }
});
