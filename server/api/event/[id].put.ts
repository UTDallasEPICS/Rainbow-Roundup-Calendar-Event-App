import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  // Access the dynamic route parameters to get the event ID
  const id = getRouterParam(event, 'id'); // Extract the ID from the dynamic route
  
  if (!id) {
    return {
      success: false,
      error: 'Event ID is required.',
    };
  }

  // Read the body to get the data to update
  const body = await readBody(event);

  try {
    const updatedEvent = await prisma.event.update({
      where: { id }, // Use the ID from the URL
      data: {
        description: body.description,
        userId: body.userId,
        eventLat: body.eventLat,
        eventLong: body.eventLong,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
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
