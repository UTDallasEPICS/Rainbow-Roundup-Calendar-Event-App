import { defineEventHandler, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  setCookie(event, 'session_id', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return { success: true };
});