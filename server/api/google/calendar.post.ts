import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import { formatEventForGoogle, formatEventForResponse } from "~/server/utils/eventFormatter.ts";

export default defineEventHandler(async (event) => {
  try {
    const calendar = getCalendarClient();
    const body = await readBody<CalendarEvent>(event);
    
    const response = await calendar.events.insert({
      calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
      requestBody: formatEventForGoogle(body),
      sendUpdates: 'all',
    });

    return formatEventForResponse(response.data);
  } catch (error: any) {
    console.error('Failed to create event:', {
      message: error.message,
      code: error.code,
      errors: error.errors,
      response: error.response?.data
    });
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create event'
    });
  }
});
