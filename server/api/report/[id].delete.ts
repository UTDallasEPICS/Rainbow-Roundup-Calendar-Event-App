import { EventImpl } from '@fullcalendar/core/internal.js';
import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Report ID is required to delete the report.',
    };
  }

  try {
    const existingReport = await prisma.report.findUnique({
      where: {id}
    })
    if(!existingReport){
      setResponseStatus(event, 404)
      return{
        success: false,
        error: 'No report with matching id'
      }
    }
    //cascade deletes
    await prisma.report.deleteMany({ where: { reporterUserId: id } });
    await prisma.report.deleteMany({ where: { reportedUserId: id } });
    // Attempt to delete the report from the database
    await prisma.report.delete({
      where: { id: String(id) },
    });
    setResponseStatus(event, 200)
    return {
      success: true,
      message: 'Report deleted successfully',
      report: existingReport
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setResponseStatus(event, 500)
    return {
      success: false,
      error: `Error deleting report: ${errorMessage}`,
    };
  }
});
