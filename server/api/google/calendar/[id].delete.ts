/*
Calendar Event Deletion Handler

The event to be deleted is taken from the route parameters

This should be called when an event is deleted on our end as well. 
 * 
 * @route DELETE /api/google/calendar/:id
 * @param event - The incoming HTTP request context in Nuxt.
 * @returns {Promise<object>} A formatted event object.

*/

import { getCalendarClient } from "~/server/utils/googleCalendar";
import { formatEventForResponse } from "~/server/utils/eventFormatter.ts";
import { auth } from "~/server/auth"
import type { User } from "@prisma/client";

export default defineEventHandler(async (event) => { 
  const session = await auth.api.getSession({
    headers:  event.headers
  })
  const user = session?.user as User | undefined;
      
    try {
      // check authentication
      if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
        throw createError({
        statusCode: 403,
        statusMessage: "Unauthenticated",
        });
      }

        const eventId = getRouterParam(event, 'id');
            // Validate that an event ID was provided
        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Event ID is required'
            });
        }
        // Get an authenticated Google Calendar client
        const calendar = getCalendarClient();
        // actually delete the event on the google calendar
        const response = await calendar.events.delete({
            calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
            eventId: eventId,
          });
      
          // Format and return the resposne from the server. 
          return { response };
    }
    catch (error: any) {
            // Handle different types of errors
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Event not found'
        });
      }
  
      console.error('Failed to delete event:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete event'
      });
    }
});
