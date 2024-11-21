// components/Calendar.vue
<template>
  <div class="calendar-container">
    <ClientOnly>
      <FullCalendar
        :options="calendarOptions"
        class="calendar"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Make sure to import the required CSS
import '@fullcalendar/core/index.css'
import '@fullcalendar/daygrid/index.css'
import '@fullcalendar/timegrid/index.css'

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  editable: true,
  selectable: true,
  events: [
    {
      title: 'Example Event',
      start: new Date(),
    }
  ],
  eventClick: (info) => {
    console.log('Event clicked:', info.event)
  },
  select: (info) => {
    console.log('Date range selected:', info.startStr, 'to', info.endStr)
  }
})
</script>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.calendar {
  height: 800px;
}
</style>
