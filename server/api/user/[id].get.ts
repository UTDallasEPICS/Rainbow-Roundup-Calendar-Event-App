/*
There is an issue in how user: singleUser is being returned and what [id].vue is picking up.
Cannot log in properly, profile page is not working, and data is not being populated for user.
*/
import { PrismaClient } from '@prisma/client';
import {getServerSession } from "#auth";
import type { User } from "../../../types/session";
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, 'id');
  const session = await getServerSession(event);
  const currentUser = session?.user as User | undefined;
  // DEBUGGING
  // console.log('debug: ', currentUser)
  // console.log('trying to access id data')

  try {
    let singleUser;
    if (id) {
      // make sure user that tries to access is authenticated and has a role
      if (!currentUser) {
        setResponseStatus(event, 401);
        return {
          success: false,
          error: 'Not authenticated.'
        };
      }
      // users with privileges have access to all data displayed 
      if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER') {
        singleUser = await prisma.user.findUnique({
          where: { id },
          include: {
            CreatedEvents: true,
            SignUps: true,
            Announcements: true,
            Reports: true,
            PotentialOffenses: true
          }
        });
      } else {
        // normal users get public-facing data only
        singleUser = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
            SignUps: true
          }
        });
      }
      if (!singleUser) {
        setResponseStatus(event, 404);
        return {
          success: false,
          error: `No user found with ID: ${id}`,
        };
      }
      setResponseStatus(event, 200);
      return {
        success: true,
        user: singleUser,
      };
    } else {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'Include an ID in your query next time, dipshit.'
      };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching user(s): ${errorMessage}`,
    };
  }
});
