import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getCookie, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  try {
    const sessionId = getCookie(event, 'session_id');
    if (!sessionId) return { user: null };

    const user = await prisma.user.findUnique({ where: { id: sessionId } });
    if (!user) return { user: null };

    return {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePic: user.profilePic,
        role: user.role,
      }
    };
  } catch (err) {
    console.error('Error in /api/user/me:', err);
    setResponseStatus(event, 500);
    return { user: null, error: 'Internal server error' };
  }
});