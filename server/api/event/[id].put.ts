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

    const updateData: any = {};
    if (body.description != null) updateData.description = body.description;
    if (body.userId != null) updateData.userId = body.userId;
    if (body.startTime != null) updateData.startTime = new Date(body.startTime);
    if (body.endTime != null) updateData.endTime = new Date(body.endTime);
    if (body.eventLat != null) updateData.eventLat = body.eventLat;
    if (body.eventLong != null) updateData.eventLong = body.eventLong;
    if (body.capacity != null) updateData.capacity = body.capacity;

    const updatedEvent = await prisma.event.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    setResponseStatus(event, 200)
    return {
      success: true,
      event: updatedEvent,
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
