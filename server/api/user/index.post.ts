import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { auth, authClient } from '~/server/auth';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const body = await readBody(event);

  const token = nanoid(32);
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    const existingPhone = await prisma.user.findUnique({
      where: { phoneNum: body.phoneNum },
    });

    if (existingUser) {
      setResponseStatus(event, 400);
      return { success: false, error: "User already exists." };
    }
    if (existingPhone) {
      setResponseStatus(event, 400);
      return { success: false, error: "An account with that phone number already exists" };
    }
    await prisma.user.create({
      data: {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        phoneNum: body.phoneNum || null,
        profilePic: body.profilePic || "/default-profile.png",
        emailNotif: false,
      },
    });

    // note: due to better auth migration, sending an email verification email is no longer needed.

    return { success: true, message: "Verification email sent." };
  } catch (err) {
    console.error("Signup error:", err);
    setResponseStatus(event, 500);
    return { success: false, error: "Failed to create pending user." };
  }
});
