import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import { formatEventForGoogle, formatEventForResponse } from "~/server/utils/eventFormatter.ts";

interface QueryParams {
  timeMin?: string;
  timeMax?: string;
  maxResults?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const calendar = getCalendarClient();
    const { timeMin, timeMax, maxResults = '100' } = getQuery<QueryParams>(event);

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      maxResults: parseInt(maxResults),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items?.map(formatEventForResponse) || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events'
    });
  }
})
