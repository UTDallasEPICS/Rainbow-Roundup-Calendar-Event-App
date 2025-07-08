import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const { token } = await readBody(event);

  try {
    const pending = await prisma.pendingUser.findUnique({ where: { token } });

    if (!pending || pending.expires < new Date()) {
      setResponseStatus(event, 400);
      return { success: false, error: "Invalid or expired token." };
    }

    // Move to User table
    await prisma.user.create({
      data: {
        email: pending.email,
        firstname: pending.firstname,
        lastname: pending.lastname,
        phoneNum: pending.phoneNum,
        profilePic: pending.profilePic,
        role: "USER",
        GlobalNotif: false,
        emailVerified: new Date(),
      },
    });

    await prisma.pendingUser.delete({ where: { token } });

    return { success: true };
  } catch (err) {
    console.error("Verification error:", err);
    setResponseStatus(event, 500);
    return { success: false, error: "Server error during verification." };
  }
});
