import { google, calendar_v3 } from 'googleapis';

import type { GoogleCalendarEvent, CalendarEvent } from '../../types/calendar';

export const formatEventForGoogle = (event: CalendarEvent): Partial<calendar_v3.Schema$Event> => ({
  summary: event.title,
  description: event.description,
  start: {
    dateTime: event.start,
    timeZone: event.timeZone || 'UTC',
  },
  end: {
    dateTime: event.end,
    timeZone: event.timeZone || 'UTC',
  },
  location: event.location,
  attendees: event.attendees?.map(email => ({ email })),
});

export const formatEventForResponse = (event: calendar_v3.Schema$Event): CalendarEvent => ({
  id: event.id!,
  title: event.summary!,
  description: event.description || undefined,
  start: event.start?.dateTime || event.start?.date!,
  end: event.end?.dateTime || event.end?.date!,
  timeZone: event.start?.timeZone || undefined,
  location: event.location || undefined,
  attendees: event.attendees?.map(a => a.email!),
});