<template>
  <div class="space-y-6 max-h-[40vh] overflow-y-auto p-4">
    <ViewEvent @close-view-event-window="showEventWindow = false" @event-deleted="(id) => deleteEvent(id)" @event-edited="(e) => editEvent(e)" 
      v-if="showEventWindow" :eventId="selectedEventId" />
    <div
      v-for="event in props.events"
      :key="event.id"
    >
      <EventAdminCard :event = "event" :focusedEventId = "focusedEventId" action="view" @event-view="showWindow"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EventAdminCard from "./EventAdminCard.vue";

const props = defineProps({
    events: {
      type: Array,
      required: true
    },
  });

const focusedEventId = ref(null)
const emit = defineEmits(["event-focused", "select-all-users"]);

const showEventWindow = ref(false);
const selectedEventId = ref("");

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