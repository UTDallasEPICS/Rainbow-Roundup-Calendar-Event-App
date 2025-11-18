import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    try{
        const events = await prisma.report.findMany({
            where: {
                isArchived: false
            },
            include: {
                ReportedUser: true,
                ReporterUser: true
            }

        })
        return events;
    }  catch (error) {
        setResponseStatus(event, 500)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          success: false,
          error: `Error fetching user(s): ${errorMessage}`,
        };
      }
});