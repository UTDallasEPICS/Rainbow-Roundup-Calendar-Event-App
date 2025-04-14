import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  // Access the dynamic route parameters to get the event ID
  const id = getRouterParam(event, 'id'); // Extract the ID from the dynamic route
  
  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: 'Event ID is required.',
    };
  }

  // Read the body to get the data to update
  const body = await readBody(event);

  // validate that new startTime/endTime (if changed) are in the right order
  if (body.startTime && body.endTime) {
    if (new Date(body.startTime) >= new Date(body.endTime)) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'EndTime must be after StartTime'
      };
    }
  }

  try {
    // check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `No event found with ID: ${id}`,
      };
    }

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
    setResponseStatus(event, 200)
    return {
      success: true,
      data: updatedEvent,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating event: ${errorMessage}`,
    };
  }
});
