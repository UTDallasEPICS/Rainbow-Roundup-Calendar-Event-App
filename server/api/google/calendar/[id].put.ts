import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import {
  formatEventForGoogle,
  formatEventForResponse,
} from "~/server/utils/eventFormatter.ts";
import { auth } from "~/server/auth"
import type { User } from "@prisma/client";

export default defineEventHandler(async (event) => {

    const session = await auth.api.getSession({
        headers:  event.headers
      })
    const user = session?.user as User | undefined;

    const calendar = getCalendarClient();
    const body = await readBody(event);

    try {
        // check user role
        if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
                throw createError({
                statusCode: 403,
                statusMessage: "Unauthenticated",
                });
            }

        // update event
        await calendar.events.update({ // Bad Request sometimes ??? :(
            calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
            eventId: body.id,
            requestBody: formatEventForGoogle(body),
        });
    }
    catch (error) {
        console.log(`Error updating Google Calendar event with ID \"${body.id}\": ${error}`)
    }
    


});
