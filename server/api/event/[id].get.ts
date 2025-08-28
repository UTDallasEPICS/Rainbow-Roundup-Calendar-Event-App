import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getRouterParam, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");

  try {
    if (id) {
      // Fetch a single event by ID with relations (admin and signUps)
      const singleEvent = await prisma.event.findUnique({
        where: { id }, //getRouterParam already defines id as a string no need to cast
        include: { User: true, SignUps: true, Anouncements: true },
      });

      if (!singleEvent) {
        setResponseStatus(event, 404);
        return {
          success: false,
          error: `No event found with ID: ${id}`,
        };
      }
      setResponseStatus(event, 200);
      return {
        success: true,
        Event: singleEvent,
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
