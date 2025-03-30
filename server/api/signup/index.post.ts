import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newSignUp = await event.context.prisma.signUp.create({
      data: {
        userId: body.userId,
        eventId: body.eventId,
        sendNotification: body.sendNotification,
      },
    });
    return newSignUp;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to register for event");
  }
});
