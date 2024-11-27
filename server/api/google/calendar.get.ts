import { getCalendarClient } from "~/server/utils/googleCalendar";
import { formatEventForResponse } from "~/server/utils/eventFormatter.ts";

interface QueryParams {
  timeMin?: string; // ISO 8601 format, optional. Specifies the minimum start time for the events to retrieve.
  timeMax?: string; // ISO 8601 format, optional. Specifies the maximum end time for the events to retrieve.
  maxResults?: string; // Optional. Maximum number of events to retrieve. Defaults to '100'.
}

/**
 * Handles fetching events from Google Calendar.
 * 
 * This endpoint integrates with the Google Calendar API to retrieve all events 
 * within a specified time range or up to a specified maximum count.
 * 
 * Query Parameters
 * - `timeMin` (string, optional): Minimum start time for events, in ISO 8601 format (e.g., `"2024-12-01T00:00:00Z"`).
 * - `timeMax` (string, optional): Maximum end time for events, in ISO 8601 format (e.g., `"2024-12-31T23:59:59Z"`).
 * - `maxResults` (string, optional): Maximum number of events to return. Defaults to `"100"`.
 * 
 * The response will return a list of event objects, each with the following structure:
 * - `id` (string): Unique identifier for the event.
 * - `title` (string): Title of the event (optional).
 * - `description` (string): Description of the event (optional).
 * - `start` (string): Start date/time of the event in ISO 8601 format.
 * - `end` (string): End date/time of the event in ISO 8601 format.
 * - `timeZone` (string): Time zone of the event (optional).
 * - `location` (string): Location of the event (optional).
 * 
 * @route GET /api/google/calendar/
 * @param event - The incoming HTTP request context in Nuxt.
 * @returns {Promise<object[]>} A list of formatted event objects.
 */
export default defineEventHandler(async (event) => {
  try {

    // Get an authenticated Google Calendar client
    const calendar = getCalendarClient();

    // Parse and validate the request query parameters
    const { timeMin, timeMax, maxResults = '100' } = getQuery<QueryParams>(event);

    // Fetch events from Google calendar
    const response = await calendar.events.list({
      calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      maxResults: parseInt(maxResults),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Format and return the list of events
    return response.data.items?.map(formatEventForResponse) || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events'
    });
  }
});
