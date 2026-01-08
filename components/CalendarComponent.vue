<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
        hide-details></v-select>
    </v-sheet>
    <v-sheet>
      <v-calendar ref="calendar" v-model="value" :events="events" :view-mode="type" 
        :weekdays="weekday"></v-calendar>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  description?: string
  location?: string
  allDay: boolean
}

export default defineComponent({
  props: {
    events: {
      type: Array as () => CalendarEvent[],
      default: () => []
    }
  },
  setup() {
    const calendar = ref(null)
    const type = ref<'month' | 'week' | 'day'>('month')
    const types: Array<'month' | 'week' | 'day'> = ['month', 'week', 'day']
    const weekday = ref([0, 1, 2, 3, 4, 5, 6])
    const value = ref([new Date()])

    return {
      calendar,
      type,
      types,
      weekday,
      value
    }
  }
})
</script>