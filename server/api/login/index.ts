import { defineEventHandler, getMethod } from 'h3';
import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '~/server/utils/login';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)
  const body = await readBody(event);
  let success = false;
  let error = null;
  try {
    if(!body.email ||!body.password){
      return {
        success,
        error:"User name and password are mandatory."
      };
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      },
    });

    const encryptedPassword = encryptPassword(body.password);

    if (user?.password === encryptedPassword) {
      success = true;
    }else{
      error="User not found, Please try with right credintials."
    }


    return {
      success,
      error
    };
  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success,
      error: `Error creating user: ${errorMessage}`,
    };
  }


});
