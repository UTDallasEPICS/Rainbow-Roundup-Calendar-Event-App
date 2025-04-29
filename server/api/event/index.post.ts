import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;


  // validate that event starts before it ends
  if (new Date(body.startTime) >= new Date(body.endTime)) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'EndTime must be after StartTime'
    };
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        description: body.description,
        userId: body.userId,
        eventLat: body.eventLat,
        eventLong: body.eventLong,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        capacity: body.capacity,
        currentCapacity: 0,
      },
    });
    setResponseStatus(event, 200)
    return {
      success: true,
      data: newEvent,
    };
  } catch (error) {
    // Use a type guard to ensure `error` is an instance of `Error`
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setResponseStatus(event, 500)
    return {
      success: false,
      error: `Error creating event: ${errorMessage}`,
    };
  }
});
