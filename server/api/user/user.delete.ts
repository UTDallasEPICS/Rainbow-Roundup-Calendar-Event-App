import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.params!;
    const deletedUser = await event.context.prisma.user.delete({
      where: { id: userId },
    });
    return { message: "User deleted successfully", deletedUser };
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to delete user");
  }
});
