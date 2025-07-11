import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from '../../utils/sendVerificationEmail';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma || new PrismaClient();
  const body = await readBody(event);

  const token = nanoid(32);
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      setResponseStatus(event, 400);
      return { success: false, error: "User already exists." };
    }

    await prisma.pendingUser.create({
      data: {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        phoneNum: body.phoneNum || null,
        profilePic: body.profilePic || null,
        token,
        expires,
      },
    });

    await sendVerificationEmail(body.email, token);

    return { success: true, message: "Verification email sent." };
  } catch (err) {
    console.error("Signup error:", err);
    setResponseStatus(event, 500);
    return { success: false, error: "Failed to create pending user." };
  }
});
