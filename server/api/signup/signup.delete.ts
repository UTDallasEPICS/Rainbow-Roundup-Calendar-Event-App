import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { signUpId } = event.context.params!;
    const deletedSignUp = await event.context.prisma.signUp.delete({
      where: { id: signUpId },
    });
    return { message: "Successfully unregistered from event", deletedSignUp };
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to unregister from event");
  }
});