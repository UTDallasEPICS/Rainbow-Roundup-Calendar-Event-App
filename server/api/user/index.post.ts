import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      },
    });

    if(existingUser){
      setResponseStatus(event, 400)
      return {
        success: false,
        error: "User with this email already exists",
      };
    }


    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        role: body.role,
        phoneNum: body.phoneNum || null,
        profilePic: body.profilePic || null,
        GlobalNotif: body.GlobalNotif || false,
      },
    });

    setResponseStatus(event, 200)
    return {
      success: true,
      data: newUser,
    };
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error creating user: ${errorMessage}`,
    };
  }
});
