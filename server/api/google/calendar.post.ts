import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import { formatEventForGoogle, formatEventForResponse } from "~/server/utils/eventFormatter.ts";
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const calendar = getCalendarClient();
    const body = await readBody<CalendarEvent>(event);
    
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      requestBody: formatEventForGoogle(body),
      sendUpdates: 'all',
    });

    return formatEventForResponse(response.data);
  } catch (error) {
    console.error('Failed to create event:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create event'
    });
  }
});
