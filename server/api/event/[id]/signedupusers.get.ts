//import { getServerSession } from "#auth";
import { auth } from "~/server/auth"
import type { User } from "../../../../types/session";

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const id = getRouterParam(event, "id");
    const session = await auth.api.getSession({
        headers:  event.headers
    })
    const user = session?.user as User | undefined;
    if(!(user?.role === "SUPER" || user?.role === "ADMIN")){
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden"
        })
    }
  try {
    if (id) {
      // Fetch a single event by ID with relations (admin and signUps)
      const singleEvent = await prisma.event.findUnique({
        where: { id }, //getRouterParam already defines id as a strisng no need to cast
        include: {
            SignUps: {
                include: {
                    User: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                            email: true,
                            emailNotif: true,
                            nativeNotif: true,
                        }
                    }
                }
            }
        }
      });

      if (!singleEvent) {
        setResponseStatus(event, 404);
        return {
          error: `No event found with ID: ${id}`,
        };
      }

      setResponseStatus(event, 200);
      return {
        Event: {
          Users: singleEvent.SignUps.map(signup => signup.User),
        },
      };
    } else {
      setResponseStatus(event, 400);
      return {
        error: "include an ID in your query next time kind sir", //never gonna see this in actual use case
      };
    }
    
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      error: `Error fetching events: ${errorMessage}`,
    };
  }
});