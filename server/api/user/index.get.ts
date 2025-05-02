import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  try{
    const events = await prisma.user.findMany({
        include: {
        CreatedEvents: true,            
        SignUps: true,         
        Announcements: true,   
        },
        orderBy: {
            lastname: 'asc',           // Optional: sort upcoming events first
        },
    });

    return events;
  }
  catch(error){
    setResponseStatus(event, 500);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error fetching users: ${errorMessage}`,
    };
  }
});

