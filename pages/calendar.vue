<template>
    <div class="mb-16 p-8">
      <p>Calendar</p>
      <CalendarComponent :events="events" />
      <div class="mt-6">
        <h2 class="text-lg font-medium">Upcoming Events</h2>
        <ul class="space-y-4 mt-4">
          <li v-for="event in events" :key="event.id" class="border rounded p-4">
            <h3 class="text-lg font-medium">{{ event.title }}</h3>
            <p class="text-sm text-gray-600">
              <template v-if="event.allDay">
                {{ formatEventDate(event.start) }}
                <span v-if="!sameDay(event.start, event.end)">- {{ formatEventDate(event.end) }}</span>
              </template>
              <template v-else>
                {{ formatEventTime(event.start) }} - {{ formatEventTime(event.end) }}
                <span>on {{ formatEventDate(event.start) }}</span>
                <span v-if="!sameDay(event.start, event.end)">- {{ formatEventDate(event.end) }}</span>
              </template>
            </p>
            <p v-if="event.description" class="text-gray-700">{{ event.description }}</p>
            <p v-if="event.location" class="text-gray-700">{{ event.location }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
      
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDate } from 'vuetify'

interface Event {
    id: string
    title: string
    start: Date
    end: Date
    color: string
    description?: string
    location?: string
    allDay: boolean
}

interface RawEvent {
    id: string
    title?: string
    start: string
    end: string
    description?: string
    location?: string
}

const events = ref<Event[]>([])

// TODO:  (small nitpick, but for the future) adjust this to only request for the current month chosen to be displayed
//        reduce client memory usage in the long term
const fetchEvents = async () => {

    try {
        const response = await $fetch<RawEvent[]>('/api/google/calendar/')

        events.value = response.map(cleanIfAllDay).map(event => ({
            id: event.id,
            title: event.title || 'Untitled Event',
            start: new Date(event.start),
            end: new Date(event.end),
            color: getEventColor(event),
            description: event.description,
            location: event.location,
            allDay: event.allDay
        }))
    } catch (error) {
        console.error('Failed to fetch events:', error)
        events.value = []
    }
}

const colors = [
    'blue', 'indigo', 'deep-purple', 'cyan',
    'green', 'orange', 'grey darken-1'
]

const getEventColor = (event: RawEvent): string => {
    const colorIndex = event.title
        ? event.title.length % colors.length
        : 0
    return colors[colorIndex]
}

const cleanIfAllDay = (event: RawEvent): RawEvent & { allDay: boolean } => {
    const start = new Date(event.start)
    const end = new Date(event.end)

    const startTimeString = start.toISOString().split('T')[1]
    const endTimeString = end.toISOString().split('T')[1]

    if (startTimeString === '00:00:00.000Z' && endTimeString === '00:00:00.000Z') {
        end.setDate(end.getDate() - 1)
        return {
            ...event,
            allDay: true,
            start: `${event.start}T00:00:00-06:00`,
            end: `${end.toISOString().split('T')[0]}T23:59:59-06:00`
        }
    }

    return { ...event, allDay: false }
}

const formatEventDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Chicago'
  }).format(date);
};

const formatEventTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'America/Chicago'
  }).format(date);
};

const sameDay = (start: Date, end: Date) => {
  return start.getFullYear() === end.getFullYear() &&
         start.getMonth() === end.getMonth() &&
         start.getDate() === end.getDate();
};

onMounted(() => {
    const adapter = useDate()
    const startOfMonth = adapter.startOfDay(adapter.startOfMonth(new Date()))
    const endOfMonth = adapter.endOfDay(adapter.endOfMonth(new Date()))

    fetchEvents()
})

</script>