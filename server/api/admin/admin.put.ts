import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: body.id },
      data: {
        email: body.email,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
      },
    });

    return {
      success: true,
      data: updatedAdmin,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating admin: ${errorMessage}`,
    };
  }
});