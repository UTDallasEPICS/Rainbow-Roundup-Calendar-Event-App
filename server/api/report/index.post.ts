import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;
  
  try {

    const { auth } = useAuth();
    if (!auth || !auth.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }
    
    const newReport = await prisma.report.create({
      data: {
        reportedUserId: body.reportedUserId,
        reporterUserId: auth.userId,
        isUsername: body.isUsername || false,
        isProfilePic: body.isProfilePic || false,
        isOther: body.isOther || false,
        description: body.description,
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
