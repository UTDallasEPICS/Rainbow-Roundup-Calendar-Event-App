import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Access the dynamic route parameters to get the event ID
  const params = event.context.params as Record<string, string> | undefined;
  const id = params?.id; // Extract the ID from the dynamic route

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
