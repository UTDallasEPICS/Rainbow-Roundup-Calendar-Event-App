import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {

    if(body.password !== body.confirmPassword){
      return {
        success: false,
        error: "Password and Confirm password are not same.",
      };
    }

    const existinguser = await prisma.user.findUnique({
      where: {
        email: body.email
      },
    });

    if(existinguser){
      return {
        success: false,
        error: "User with this email already exists",
      };
    }


    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: "", // password set to "" as a band-aid. This will be overwritten when a merge conflict inevitably happens because password in general is being deleted. 
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
