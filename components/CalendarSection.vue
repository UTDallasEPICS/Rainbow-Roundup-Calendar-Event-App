<!-- src/components/CalendarSection.vue -->
<template>
  <div>
    <!-- Section title -->
    <div class="text-center">
      <div
        class="text-xs md:text-sm font-extrabold uppercase text-zinc-700 mb-2"
      >
        Your Calendar
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-6"
    >
      <!-- Calendar Grid -->
      <div class="w-full md:w-2/3">
        <!-- Month nav + buttons -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <!-- Prev month -->
            <button
              @click="prevMonth"
              class="p-1 text-gray-600 hover:text-gray-800"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <!-- Month label -->
            <h2 class="text-2xl font-semibold">{{ monthLabel }}</h2>
            <!-- Next month -->
            <button
              @click="nextMonth"
              class="p-1 text-gray-600 hover:text-gray-800"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Show/Hide & Add -->
          <div class="flex items-center space-x-2">
            <button
              @click="toggleEvents"
              class="text-sm text-blue-600 underline hover:text-blue-800 transition"
            >
              {{ showEvents ? "Hide" : "Show" }} Events
            </button>
            <button
              @click="$emit('add-event')"
              class="text-sm text-blue-600 underline hover:text-blue-800 transition"
            >
              Add Event
            </button>
          </div>
        </div>

        <!-- Weekday headers -->
        <div
          class="grid grid-cols-7 gap-2 text-center text-sm text-gray-700 font-semibold mb-2"
        >
          <div v-for="d in weekdayNames" :key="d">{{ d }}</div>
        </div>

        <!-- Day cells -->
        <div class="grid grid-cols-7 gap-2 text-center">
          <template v-for="day in daysInMonth" :key="day">
            <div
              @click="selectDate(day)"
              class="h-20 border rounded-lg p-2 hover:bg-blue-100 cursor-pointer flex flex-col items-start"
            >
              <span class="text-sm font-bold text-gray-700">{{ day }}</span>
              <!-- dot indicator if events exist -->
              <div
                v-if="eventsByDate[day]?.length"
                class="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"
              ></div>
            </div>
          </template>
        </div>
      </div>

      <!-- Events Panel -->
      <div
        v-show="showEvents"
        class="w-full md:w-1/3 bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-300 ease-in-out"
      >
        <h3 class="text-lg font-semibold mb-3">
          Events for {{ monthLabel }} {{ selectedDate }}
        </h3>
        <ul class="space-y-2 text-sm">
          <li
            v-for="ev in eventsByDate[selectedDate] || []"
            :key="ev.id"
            class="p-2 rounded bg-white border border-gray-200"
          >
            <p class="font-medium">{{ ev.title }}</p>
            <p class="text-gray-600">
              {{ formatTime(ev.start) }} - {{ formatTime(ev.end) }}
            </p>
          </li>
          <li
            v-if="
              !(eventsByDate[selectedDate] && eventsByDate[selectedDate].length)
            "
            class="text-gray-500 italic"
          >
            No events for this day.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
}

// <-- receives your events array -->
const props = defineProps<{ events: CalendarEvent[] }>();
// <-- emits when Add Event is clicked -->
const emit = defineEmits<{
  (e: "add-event"): void;
}>();

// controls panel visibility
const showEvents = ref(false);
// which day is selected
const selectedDate = ref(new Date().getDate());
// first-of-month pointer
const current = ref(new Date());

// nicely formatted "May 2025"
const monthLabel = computed(() =>
  current.value.toLocaleString("default", { month: "long", year: "numeric" })
);
// how many days that month has
const daysInMonth = computed(() =>
  new Date(
    current.value.getFullYear(),
    current.value.getMonth() + 1,
    0
  ).getDate()
);

// map day → list of events on that date
const eventsByDate = computed<Record<number, CalendarEvent[]>>(() => {
  const map: Record<number, CalendarEvent[]> = {};
  props.events.forEach((e) => {
    const d = new Date(e.start);
    if (
      d.getFullYear() === current.value.getFullYear() &&
      d.getMonth() === current.value.getMonth()
    ) {
      const day = d.getDate();
      (map[day] ||= []).push(e);
    }
  });
  return map;
});

// weekday labels
const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toggleEvents() {
  showEvents.value = !showEvents.value;
}

function selectDate(day: number) {
  selectedDate.value = day;
}

// move the calendar back or forward one month
function prevMonth() {
  const y = current.value.getFullYear();
  const m = current.value.getMonth() - 1;
  current.value = new Date(y, m, 1);
}
function nextMonth() {
  const y = current.value.getFullYear();
  const m = current.value.getMonth() + 1;
  current.value = new Date(y, m, 1);
}

// helper to format a Date to "10:00 AM"
function formatTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
</script>
