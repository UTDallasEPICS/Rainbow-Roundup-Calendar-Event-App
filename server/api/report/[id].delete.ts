
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

    // mark reports as archived
    await prisma.report.update({
      where: { id },
      data: { isArchived: true }
    })

    console.log("UPDATED")

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
