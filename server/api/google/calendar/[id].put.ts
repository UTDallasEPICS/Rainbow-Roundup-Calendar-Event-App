import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import {
  formatEventForGoogle,
  formatEventForResponse,
} from "~/server/utils/eventFormatter.ts";
import { getServerSession } from "#auth";
import type { User } from "../../../../types/session";

export default defineEventHandler(async (event) => {

    const calendar = getCalendarClient();
    const body = await readBody(event);

    try {
        // update event
        await calendar.events.update({
            calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
            eventId: body.id,
            requestBody: formatEventForGoogle(body),
        });
    }
    catch (error) {
        console.log(`Error updating Google Calendar event with ID \"${body.id}\": ${error}`)
    }
    


});
