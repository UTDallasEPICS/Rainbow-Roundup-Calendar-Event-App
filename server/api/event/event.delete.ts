import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { eventId } = event.context.params!;
    const deletedEvent = await event.context.prisma.event.delete({
      where: { id: eventId },
    });
    return { message: "Event deleted successfully", deletedEvent };
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to delete event");
  }
});
