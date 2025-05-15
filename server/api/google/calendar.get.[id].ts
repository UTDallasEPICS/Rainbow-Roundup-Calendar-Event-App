import { getCalendarClient } from "~/server/utils/googleCalendar";
import { formatEventForResponse } from "~/server/utils/eventFormatter.ts";

/**
 * Handles fetching a single event from Google Calendar by its event ID.
 *
 * This endpoint integrates with the Google Calendar API to retrieve a specific event
 * using its unique identifier.
 *
 * Route Parameter:
 * - `id` (string): The unique identifier of the event in Google Calendar.
 *
 * The response will return a single event object with the following structure:
 * - `id` (string): Unique identifier for the event.
 * - `title` (string): Title of the event (optional).
 * - `description` (string): Description of the event (optional).
 * - `start` (string): Start date/time of the event in ISO 8601 format.
 * - `end` (string): End date/time of the event in ISO 8601 format.
 * - `timeZone` (string): Time zone of the event (optional).
 * - `location` (string): Location of the event (optional).
 *
 * @route GET /api/google/calendar/:id
 * @param event - The incoming HTTP request context in Nuxt.
 * @returns {Promise<object>} A formatted event object.
 */
export default defineEventHandler(async (event) => {
  try {
    // Extract the event ID from the route parameters

    const eventId = getRouterParam(event, "id");

    // Validate that an event ID was provided
    if (!eventId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Event ID is required",
      });
    }

    // Get an authenticated Google Calendar client
    const calendar = getCalendarClient();

    // Fetch the specific event from Google Calendar
    const response = await calendar.events.get({
      calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
      eventId: eventId,
    });

    // Format and return the event
    return formatEventForResponse(response.data);
  } catch (error: any) {
    // Handle different types of errors
    if (error.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Event not found",
      });
    }

    console.error("Failed to fetch event:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch event details",
    });
  }
});
