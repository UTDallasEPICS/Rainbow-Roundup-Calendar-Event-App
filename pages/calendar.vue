<template>
    <div class="p-8">
        <p>Calendar</p>
        <CalendarComponent :events="events" />
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

const fetchEvents = async (start: any, end: any) => {

    try {
        const response = await $fetch<RawEvent[]>('/api/google/calendar/', {
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        })

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
onMounted(() => {
    const adapter = useDate()
    const startOfMonth = adapter.startOfDay(adapter.startOfMonth(new Date()))
    const endOfMonth = adapter.endOfDay(adapter.endOfMonth(new Date()))

    fetchEvents(startOfMonth, endOfMonth)
})

</script>