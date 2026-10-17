<template>
  <div class="space-y-6 max-h-[40vh] overflow-y-auto p-4">
    <div v-for="entry in props.manualEntries" :key="entry.id" :class="['rounded-2xl shadow flex items-center cursor-pointer hover:bg-gray-50 transition p-4', focusedEventId === null ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white']">
      <div @click="handleClick(entry)" class="flex items-center w-full">
        <div class="flex-1 text-left">
          <div class="text-xs text-indigo-500 font-normal">
            •
          </div>
          <div class="text-base text-slate-900 font-medium">
            {{ entry.title }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="event in props.events"
      :key="event.id"
    >
      <EventAdminCard :event = "event" :focusedEventId = "focusedEventId" action="focus" @event-focused="focusEvent"/>
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
    action: {
      type: String,
      default: 'view'
    },
    manualEntries: {
      type: Array,
      default: () => []
    }
  });

const focusedEventId = ref(null)
const emit = defineEmits(["event-focused", "select-all-users"]);

const showEventWindow = ref(false);
const selectedEventId = ref("");

function handleClick(event) {
  if (props.action == "view") { //show ViewEvent
    showWindow(event.id)
  }
  else if (props.action == "focus") { //display focused version of selected event
    if (event?.type == "event") { //is the passed object actually an event. If not it'll use the other function meant for the All users case
      focusEvent(event)
    }
    else {
      focusUsers(event)
    }
  }
  
}

function focusEvent(event) {
  focusedEventId.value = event.id
  emit("event-focused", event)
}

function focusUsers(users) {
  focusedEventId.value = null
  emit("select-all-users")
}

function showWindow(id) {
  selectedEventId.value = id;
  showEventWindow.value = true;
}

</script>