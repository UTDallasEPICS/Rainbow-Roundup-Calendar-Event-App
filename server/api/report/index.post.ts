import { PrismaClient } from '@prisma/client';

import { User } from "../../../types/session";

import { auth } from '~/server/auth';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;
  const session = await auth.api.getSession({
      headers:  event.headers
  })
  const user = session?.user as User | undefined;

  if (!user || !user?.role) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  
  try { 
    const newReport = await prisma.report.create({
      data: {
        reportedUserId: body.reportedUserId,
        reporterUserId: user.id,
        isUsername: body.isUsername || false,
        isProfilePic: body.isProfilePic || false,
        isOther: body.isOther || false,
        description: body.description,
        isArchived: false,
      },
    });

    return {
      success: true,
      report: newReport,
    };
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error creating report: ${errorMessage}`,
    };
  }
});
