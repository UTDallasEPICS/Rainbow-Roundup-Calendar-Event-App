import { getCalendarClient } from "~/server/utils/googleCalendar";
import { CalendarEvent } from "~/types/calendar";
import {
  formatEventForGoogle,
  formatEventForResponse,
} from "~/server/utils/eventFormatter.ts";
import { getServerSession } from "#auth";

/**
 * Handles the creation of a new event in Google Calendar.
 *
 * This endpoint integrates with the Google Calendar API to create a new calendar event.
 *
 * Expected Request Body
 * The request body should include the following:
 * - `title` (string): The title of the event.
 * - `description` (string): A description of the event.
 * - `start` (string): The start time of the event in ISO 8601 format; write date and time as the time zone the event occurs in. (e.g. "2024-12-10T19:00:00")
 * - `end` (string): The end time of the event in ISO 8601 format; write date and time as the time zone the event occurs in. (e.g. "2024-12-10T19:00:00")
 * - `timeZone` (string): The time zone of the event (e.g., "UTC", "CST", "PST", etc.).
 * - `location` (string): The location of the event.
 *
 * The response will return the created event in the following structure:
 * - `id` (string): The unique identifier of the created event in Google Calendar.
 * - `title` (string): The title of the event.
 * - `description` (string): The event description.
 * - `start` (string): The start time of the event, adjusted to the user's time zone.
 * - `end` (string): The end time of the event, adjusted to the user's time zone.
 * - `timeZone` (string): The time zone of the event.
 * - `location` (string): The location of the event.
 *
 * @route POST /api/google/calendar/
 * @param event - The incoming HTTP request context in Nuxt.
 * @returns The formatted details of the newly created event.
 */
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated!" };
  }

  try {
    // Get an authenticated Google Calendar client
    const calendar = getCalendarClient();

    // Parse and validate the request body
    const body = await readBody<CalendarEvent>(event);
    console.log(body);

    // Insert the event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
      requestBody: formatEventForGoogle(body),
      sendUpdates: "all",
    });

    // Format and return the created event
    return formatEventForResponse(response.data);
  } catch (error: any) {
    console.error("Failed to create event:", {
      message: error.message,
      code: error.code,
      errors: error.errors,
      response: error.response?.data,
    });

    // Return a 500 Internal Server Error if something goes wrong
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create event",
    });
  }
});
