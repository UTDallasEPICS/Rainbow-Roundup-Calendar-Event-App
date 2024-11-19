import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';



export default defineEventHandler(async (event) => {
  try {
    
    const { userId } = event.context.params!;

    // Creating a new Admin record associated with this user
    const promotedAdmin = await event.context.prisma.admin.create({
      data: { personId: userId },
    });

    return { message: "User promoted to admin", promotedAdmin };
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to promote user to admin");
  }
});
