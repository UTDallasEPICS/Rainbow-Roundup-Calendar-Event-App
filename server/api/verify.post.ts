
import { defineEventHandler, readBody, setResponseStatus, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const config = useRuntimeConfig();
  const { token } = await readBody(event);

  try {
    const pending = await prisma.pendingUser.findUnique({ where: { token } });

    if (!pending || pending.expires < new Date()) {
      setResponseStatus(event, 400);
      return { success: false, error: "Invalid or expired token." };
    }

    // Move to User table
    const user = await prisma.user.create({
      data: {
        email: (pending.email as string).toLowerCase(), //"as string" is NOT a boiler plate, Do not remove
        firstname: pending.firstname,
        lastname: pending.lastname,
        phoneNum: pending.phoneNum,
        profilePic: pending.profilePic,
        role: "USER",
        emailNotif: false,
        emailVerified: false,
      },
    });

    await prisma.pendingUser.delete({ where: { token } });

    // user will stay logged in for 1 day
    setCookie(event, 'session_id', user.id, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: config.public.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // redirect to home
    return { success: true, redirect: "/" };
  } catch (err) {
    console.error("Verification error:", err);
    setResponseStatus(event, 500);
    return { success: false, error: "Server error during verification." };
  }
});
