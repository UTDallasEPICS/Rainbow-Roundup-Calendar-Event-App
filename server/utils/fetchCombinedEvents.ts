// your models
export interface GoogleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
}

export interface LocalEventData {
  id: string;
  capacity: number;
  currentCapacity: number;
  tags: string[];
  SignUps?: LocalSignUp[];
}

export interface LocalSignUp {
  id: string;
  userId: string;
  notifications: boolean;
  user?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
}

// Response structure for single local event fetch
export interface LocalEventExtraById {
  Event: LocalEventData;
}

export interface CombinedEvent extends GoogleEvent {
  capacity?: number;
  currentCapacity?: number;
  tags?: string[];
  signUps?: LocalSignUp[];
}

/// Fetch all from Google Calendar API
async function fetchGoogleCalendarEvents(): Promise<GoogleEvent[]> {
  try {
    const events = await $fetch<GoogleEvent[]>("/api/google/calendar");
    return events ?? [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
}

// Fetch all from your own server
async function fetchLocalDatabaseExtras(): Promise<LocalEventData[]> {
  try {
    const extras = await $fetch<LocalEventData[]>("/api/event");
    return extras ?? [];
  } catch (error) {
    console.error("Error fetching local event extras:", error);
    return [];
  }
}

// Merge both (for list)
export async function fetchCombinedEvents(): Promise<CombinedEvent[]> {
  const [googleEvents, localExtras] = await Promise.all([
    fetchGoogleCalendarEvents(),
    fetchLocalDatabaseExtras(),
  ]);

  return googleEvents.map((event) => {
    const extra = localExtras.find((e) => e.id === event.id);

    return {
      ...event,
      capacity: extra?.capacity,
      currentCapacity: extra?.currentCapacity,
      tags: extra?.tags,
      signUps: extra?.SignUps?.slice(0, 3) ?? [], // return only first 3 signups
    };
  });
}

// Fetch ONE event by ID (and fix .event nesting)
export async function fetchCombinedEventById(
  id: string
): Promise<CombinedEvent | null> {
  try {
    const [googleEvent, localExtra] = await Promise.all([
      $fetch<GoogleEvent>(`/api/google/calendar/${id}`),
      $fetch<LocalEventExtraById>(`/api/event/${id}`),
    ]);

    return {
      ...googleEvent,
      capacity: localExtra?.Event.capacity,
      currentCapacity: localExtra?.Event.currentCapacity,
      tags: localExtra?.Event.tags,
      signUps: localExtra?.Event.SignUps ?? [],
    };
  } catch (error) {
    console.error(`Error fetching combined event for id ${id}:`, error);
    return null;
  }
}
