import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  // Access the dynamic route parameters to get the signup ID
  const prisma = event.context.prisma
  const id = getRouterParam(event, 'id'); // Extract the ID from the dynamic route

  if (!id) {
    setResponseStatus(event, 400); //idk the proper hhtp response
    return {
      success: false,
      error: 'Signup ID is required.',
    };
  }

  try {
    // Find the signup
    const existingSignUp = await prisma.signUp.findUnique({
      where: { id },
    });

    if (!existingSignUp) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: 'No signup with matching id'
      };
    }

    // Get the associated event
    const associatedEvent = await prisma.event.findUnique({
      where: { id: existingSignUp.eventId }
    });

    // Delete the signup
    await prisma.signUp.delete({
      where: { id }
    });

    // Update event capacity if needed
    if (associatedEvent && associatedEvent.capacity !== null && associatedEvent.currentCapacity !== null) {
      await prisma.event.update({
        where: { id: existingSignUp.eventId },
        data: {
          currentCapacity: {
            decrement: 1,
          },
        },
      });
    }

    return {
      success: true,
      signup: existingSignUp
    };

  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error deleting signup: ${errorMessage}`,
    };
  }
});
