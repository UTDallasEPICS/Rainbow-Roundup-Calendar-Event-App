<template>
  <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    <div class="flex flex-col md:flex-row">
      <!-- Calendar -->
      <div class="w-full p-4">
        <!-- Month nav -->
        <div class="flex items-center justify-between mb-2">
          <button
            @click="prevMonth"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ‹
          </button>
          <span class="font-medium text-base">
            {{ monthName }} {{ currentYear }}
          </span>
          <button
            @click="nextMonth"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ›
          </button>
        </div>

        <!-- Weekday labels -->
        <div class="grid grid-cols-7 text-sm text-gray-500 mb-2">
          <div v-for="d in dayNames" :key="d">{{ d }}</div>
        </div>

        <!-- Day cells -->
        <div class="grid grid-cols-7 gap-1">
          <template v-for="day in daysInMonth" :key="day">
            <button
              @click="
                selectDate(day);
                showEvents = true;
              "
              class="relative w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 focus:outline-none"
              :class="{ 'bg-indigo-50': isToday(day) }"
            >
              <span class="text-sm text-gray-700">{{ day }}</span>
              <span
                v-if="eventsForDay(day).length"
                class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full"
              ></span>
            </button>
          </template>
        </div>
      </div>

      <!-- Events Sidebar -->
      <aside
        v-show="showEvents"
        class="w-full md:w-72 bg-gray-50 border-t border-gray-200 md:border-t-0 md:border-l p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">
            Events for {{ formattedSelectedDate }}
          </h3>
          <button
            @click="showEvents = false"
            class="w-6 h-6 flex items-center justify-center text-gray-600 rounded hover:bg-gray-100"
          >
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-4 h-4">
              <path
                fill-rule="evenodd"
                d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 
                   1 0 011.414 1.414L11.414 10l2.293 2.293a1 
                   1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 
                   1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 
                   1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <ul class="space-y-3 text-sm">
          <li
            v-for="evt in filteredEvents"
            :key="evt.id"
            class="p-3 bg-white border border-gray-200 rounded hover:shadow transition"
          >
            <p class="font-medium text-gray-800">{{ evt.title }}</p>
            <p class="text-gray-600 leading-tight">{{ evt.time }}</p>
            <p v-if="evt.location" class="text-gray-500 leading-tight truncate">
              {{ evt.location }}
            </p>
            <p
              v-if="evt.description"
              class="text-gray-500 leading-tight truncate"
            >
              {{ evt.description }}
            </p>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang='js'> // TODO: Should be lang='ts' but that for later
import { ref, computed, watch } from "vue";

// define a prop to receive events from parent
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

// Today's date info
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

// Month state
const showEvents = ref(true);
const daysInMonth = Array.from(
  { length: new Date(currentYear, currentMonth + 1, 0).getDate() },
  (_, i) => i + 1
);
const monthName = today.toLocaleString("default", { month: "long" });
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Use the prop instead of fetching
const allEvents = ref([]);

// whenever the prop changes (or on mount), populate allEvents
watch(
  () => props.events,
  (newEvents) => {
    allEvents.value = newEvents.map((evt) => {
      const start = new Date(evt.start);
      const end = new Date(evt.end);
      return {
        id: evt.id,
        title: evt.title,
        date: start,
        time: `${start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        description: evt.description,
        location: evt.location,
        signUps: evt.signUps,
        capacity: evt.capacity,
        currentCapacity: evt.currentCapacity,
      };
    });
  },
  { immediate: true }
);

// Selected date
const selectedDate = ref(new Date(currentYear, currentMonth, currentDay));
const formattedSelectedDate = computed(() =>
  selectedDate.value.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
);

// Filtered events for selected date
const filteredEvents = computed(() =>
  allEvents.value.filter(
    (evt) => evt.date.toDateString() === selectedDate.value.toDateString()
  )
);

// Events for a specific calendar day
function eventsForDay(day) {
  return allEvents.value.filter(
    (evt) =>
      evt.date.getFullYear() === currentYear &&
      evt.date.getMonth() === currentMonth &&
      evt.date.getDate() === day
  );
}

// Methods
function isToday(day) {
  return day === currentDay;
}

function selectDate(day) {
  selectedDate.value = new Date(currentYear, currentMonth, day);
}
</script>
