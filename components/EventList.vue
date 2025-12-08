<template>
  <div class="space-y-6">
    <ViewEvent @close-view-event-window="showEventWindow = false" @event-deleted="(id) => deleteEvent(id)" @event-edited="(e) => editEvent(e)" 
      v-if="showEventWindow" :eventId="selectedEventId" />
    <div
      v-for="event in props.events"
      :key="event.id"
      class="bg-white rounded-2xl shadow flex items-center p-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <div @click="showWindow(event.id)" class="flex items-center w-full">
        <!-- left color block -->
        <div
          class="w-20 h-24 bg-amber-300 rounded-[10px] flex-shrink-0 mr-4"
        ></div>

        <!-- event info -->
        <div class="flex-1 text-left">
          <div class="text-xs text-indigo-500 font-normal">
            {{ formatDateAndTime(event.start).date }} •
            {{ formatDateAndTime(event.start).time }}
          </div>
          <div class="text-base text-slate-900 font-medium">
            {{ event.title }}
          </div>
          <div class="text-xs text-gray-500 font-normal">
            {{ event.location }}
          </div>
        </div>

        <!-- status badge -->
        <div
          class="w-7 h-7 bg-orange-100 rounded-md backdrop-blur-[3px] flex items-center justify-center"
        >
          <div
            class="w-3 h-3 rounded-full"
            :class="isPast(event.start) ? 'bg-red-400' : 'bg-gray-400'"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(['events']);

const showEventWindow = ref(false);
const selectedEventId = ref("");

function formatDateAndTime(isoString) {
  if (!isoString) return { date: "", time: "" };

  const dateObj = new Date(isoString);

  const dateOptions = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions);

  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedTime = `${formattedHour}:${minute
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return { date: formattedDate, time: formattedTime };
}

function isPast(iso) {
  const eventDate = new Date(iso);
  const now = new Date();
  return eventDate < now;
}

function showWindow(id) {
  selectedEventId.value = id;
  showEventWindow.value = true;
}

// given an id of an event, deletes event from the list
function deleteEvent(deleteId) {

  // search through events in event list. if event id matches, then delete it from the list
  for (let i = 0; i < props.events.length; i++)
  {
    if (props.events[i].id == deleteId)
    {
      props.events.splice(i, 1);
      break;
    }
  }
}

// given an edited version of an event, edit the event in the list
function editEvent(newEvent) {
  console.log(newEvent);
  for (let i = 0; i < props.events.length; i++)
    {
      if (props.events[i].id == newEvent.id)
      {
          props.events[i] = newEvent;
          break;
      }
    }
}
</script>
