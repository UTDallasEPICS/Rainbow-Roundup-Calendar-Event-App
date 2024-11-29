import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
        phoneNum: body.phoneNum || null,
        profilePic: body.profilePic || null,
      },
    });

    return {
      success: true,
      data: newUser,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error creating user: ${errorMessage}`,
    };
  }
});
