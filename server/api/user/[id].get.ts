import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, 'id')

  try {
    if (id) {
      // Fetch a single user by ID
      const singleUser = await prisma.user.findUnique({
        where: { id },
        include: {
          CreatedEvents: true,
          SignUps: true,
          Announcements: true,
          Reports: true,
          PotentialOffenses: true
        }
      });

      if (!singleUser) {
        setResponseStatus(event, 404)
        return {
          success: false,
          error: `No user found with ID: ${id}`,
        };
      }
      setResponseStatus(event, 200)
      return {
        success: true,
        User: singleUser,
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
      error: `Error fetching user(s): ${errorMessage}`,
    };
  }
});