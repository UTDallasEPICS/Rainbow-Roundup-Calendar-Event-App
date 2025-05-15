import { PrismaClient } from '@prisma/client';
import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, 'id')

  try {
    if (id) {
      // Fetch a single report by ID
      const singleReport = await prisma.report.findUnique({
        where: {id},
        include: {
          ReportedUser: true,
          ReporterUser: true
        }
      });

      if (!singleReport) {
        setResponseStatus(event, 404)
        return {
          success: false,
          error: `No report found with ID: ${id}`,
        };
      }
      setResponseStatus(event, 200)
      return {
        success: true,
        Report: singleReport,
      };
    }
    else{
      setResponseStatus(event, 400)
      return{
      success: false,
      error: 'include an ID in your query next time dipshit'
    }
    }
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching report: ${errorMessage}`,
    };
  }
});