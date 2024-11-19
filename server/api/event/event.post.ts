import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newEvent = await event.context.prisma.event.create({
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
    return newEvent;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to create event");
  }
});