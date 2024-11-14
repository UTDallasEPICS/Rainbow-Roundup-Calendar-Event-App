export interface CalendarEvent {
    id?: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    timeZone?: string;
    location?: string;
    attendees?: string[];
  }
  
  export interface GoogleCalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    location?: string;
    attendees?: Array<{ email: string }>;
    created?: string;
    updated?: string;
  }
  