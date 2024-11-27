import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

// Singleton instance of the calendar client
let calendarClient: calendar_v3.Calendar | null = null;

// Initialize the calendar client only once
export const getCalendarClient = (): calendar_v3.Calendar => {
  if (!calendarClient) {
    const auth = new JWT({
      email: process.env.NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.NUXT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [ // set the right scope
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    calendarClient = google.calendar({ version: 'v3', auth });
  }
  return calendarClient;
};
