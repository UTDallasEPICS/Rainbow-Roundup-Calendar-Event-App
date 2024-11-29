<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
        hide-details></v-select>
    </v-sheet>
    <v-sheet>
      <v-calendar ref="calendar" v-model="value" :events="formattedEvents" :view-mode="type"
        :weekdays="weekday"></v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDate } from 'vuetify'

/** TODO: make it to where all day events are still visible on weekly and daily view
 *        currently, all day events are currently only visible on monthly view. We stil
 *        want to use the allDay flag to mark events as all day on monthly view.
 */
export default {
  setup() {
    const calendar = ref(null)
    const type = ref('month')
    const types = ['month', 'week', 'day']
    const weekday = ref([0, 1, 2, 3, 4, 5, 6])
    const value = ref([new Date()])
    const events = ref([])

    const colors = [
      'blue', 'indigo', 'deep-purple', 'cyan',
      'green', 'orange', 'grey darken-1'
    ]

    const getEventColor = (event) => {
      // Generate a consistent color based on the event's title
      const colorIndex = event.title
        ? event.title.length % colors.length
        : 0
      return colors[colorIndex]
    }

    const fetchEvents = async (start, end) => {
      try {
        const response = await $fetch('/api/google/calendar/', {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        })


        // Map API events to calendar component format
        const cleanedEvents = response.map(cleanIfAllDay)
        console.log(cleanedEvents) // for debugging 
        events.value = cleanedEvents.map(event => ({
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

    // helper function to clean date with proper all day format for v-calendar
    // might just move this code to be handled on the backend
    const cleanIfAllDay = (event) => {
      // Get the start and end date objects
      const start = new Date(event.start)
      const end = new Date(event.end)

      // Check if both start and end dates are in 'YYYY-MM-DD' format (i.e., no time component)
      const startTimeString = start.toISOString().split('T')[1] // Get the time part of the start date
      const endTimeString = end.toISOString().split('T')[1] // Get the time part of the end date

      // properly suffix with time if event is all day (i.e., time is not suffixed and detected as '00:00:00.000Z' above)
      if (startTimeString === '00:00:00.000Z' && endTimeString === '00:00:00.000Z') {
        event.allDay = true;
        event.start = `${event.start}T00:00:00-06:00`;
        end.setDate(end.getDate() - 1); // Subtract one day from the end date
        event.end = `${end.toISOString().split('T')[0]}T23:59:59-06:00`; // Set time to 23:59:59
      }
      else { event.allDay = false }

      return event;
    }

    onMounted(() => {
      const adapter = useDate()
      const startOfMonth = adapter.startOfDay(adapter.startOfMonth(new Date()))
      const endOfMonth = adapter.endOfDay(adapter.endOfMonth(new Date()))

      fetchEvents(startOfMonth, endOfMonth)
    })

    return {
      calendar,
      type,
      types,
      weekday,
      value,
      formattedEvents: events,
      fetchEvents
    }
  },
  methods: {
    // Optional method to manually refresh events
    async refreshEvents() {
      const adapter = useDate()
      const startOfMonth = adapter.startOfDay(adapter.startOfMonth(new Date()))
      const endOfMonth = adapter.endOfDay(adapter.endOfMonth(new Date()))

      await this.fetchEvents(startOfMonth, endOfMonth)
    }
  }
}
</script>