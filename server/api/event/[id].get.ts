import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getRouterParam, setResponseStatus } from "h3";
//import { getServerSession } from "#auth";
import { auth } from "~/server/auth"
import type { User } from "../../../types/session";

//cc = 
function computeCC_SignUp(signUps:{plusOneKids:number; plusOneAdults: number}[])
{
  const baseAttendees = signUps.length;
  //plus one kid constant
  const plusOneKids = signUps.reduce ((t,x) => t + (x.plusOneKids?? 0),0);
  //plus one Adult constant
  const plusOneParent = signUps.reduce ((t,x)=> t + (x.plusOneAdults ?? 0 ), 0);
  //compute the plus one together
  return baseAttendees + plusOneKids + plusOneParent;
}

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");
  const session = await auth.api.getSession({
                headers:  event.headers
            })
  const user = session?.user as User | undefined;
  try {
    if (id) {
      // Fetch a single event by ID with relations (admin and signUps)
      const singleEvent = await prisma.event.findUnique({
        where: { id }, //getRouterParam already defines id as a strisng no need to cast
        include: { User: true, SignUps: true,}, // omit sensitive info
      });

      if (!singleEvent) {
        setResponseStatus(event, 404);
        return {
          success: false,
          error: `No event found with ID: ${id}`,
        };
      }

      // only admin/super can access archives
      if (singleEvent.isArchived)
      {
        //const session = await getServerSession(event);
        const session = await auth.api.getSession({
              headers:  event.headers
        })
        const user = session?.user as User | undefined;

        if (!user || (!["SUPER", "ADMIN"].includes(user.role) && user.id !== id)) {
          throw createError({
            statusCode: 403,
            statusMessage: "Unauthenticated",
          });
        }
      }
      if(!(user?.role === "SUPER" || user?.role === "ADMIN")){
        singleEvent.SignUps.forEach(signup =>{
          signup.plusOneAdults = signup.plusOneAdults + signup.plusOneKids
          signup.plusOneKids = 0
        })
      }
      //cc = compute capacity
       const cc = computeCC_SignUp(singleEvent.SignUps);
      // Optional Code: remaining capacity
      // const rc = singleEvent.capacity == null ? null : Math.max(0, singleEvent.capacity - cc);

      setResponseStatus(event, 200);
      return {
        success: true,
        Event: {
          ...singleEvent,
          // computed field
          currentCapacity: cc,
          //remainingCapacity: rc // optional but useful
        },
      };
    } else {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: "include an ID in your query next time dipshit", //never gonna see this in actual use case
      };
    }
    
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error fetching events: ${errorMessage}`,
    };
  }
});
/*
  if (id)
    const eventData = getUnique (id)
      if(!eventdata)
        return 404
      else
        return eventData
  else 
    return all events
*/
