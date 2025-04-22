<template>
  <div class="calendar-container">
    <ClientOnly>
      <FullCalendar :options="calendarOptions" class="calendar" />
    </ClientOnly>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <h3>Add Event</h3>
          <form @submit.prevent="submitEvent">
            <input v-model="eventForm.title" placeholder="Title" required />
            <textarea
              v-model="eventForm.description"
              placeholder="Description"
            ></textarea>
            <input v-model="eventForm.location" placeholder="Location" />
            <label>
              Start Time:
              <input
                type="datetime-local"
                :value="eventForm.start?.slice(0, 16)"
                @input="eventForm.start = $event.target.value"
              />
            </label>
            <label>
              End Time:
              <input
                type="datetime-local"
                :value="eventForm.end?.slice(0, 16)"
                @input="eventForm.end = $event.target.value"
              />
            </label>
            <select v-model="eventForm.timeZone">
              <option value="UTC">UTC</option>
              <option value="CST">CST</option>
              <option value="PST">PST</option>
              <!-- Add more timezones as needed -->
            </select>
            <div class="modal-actions">
              <button type="submit">Add Event</button>
              <button @click="showModal = false" type="button">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showEventModal" class="modal-backdrop">
        <div class="modal">
          <h3 class="modal-title">{{ selectedEvent?.title }}</h3>
          <p>
            <strong>Description:</strong>
            {{ selectedEvent?.description || "N/A" }}
          </p>
          <p>
            <strong>Location:</strong> {{ selectedEvent?.location || "N/A" }}
          </p>
          <p>
            <strong>Start:</strong>
            {{ new Date(selectedEvent?.start).toLocaleString() }}
          </p>
          <p>
            <strong>End:</strong>
            {{ new Date(selectedEvent?.end).toLocaleString() }}
          </p>

          <div class="rsvp-section">
            <p class="rsvp-label">Are you going?</p>
            <div class="rsvp-buttons">
              <button
                class="event-btn"
                :class="{ yes: true, selected: rsvpResponse === 'yes' }"
                @click="respondToEvent('yes')"
              >
                Yes
              </button>
              <button
                class="event-btn"
                :class="{ no: true, selected: rsvpResponse === 'no' }"
                @click="respondToEvent('no')"
              >
                No
              </button>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="showEventModal = false" type="button">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const { status } = useAuth();
const isAuthenticated = computed(() => status.value === "authenticated");

const showModal = ref(false);
const eventForm = ref({
  title: "",
  description: "",
  start: "",
  end: "",
  timeZone: "UTC",
  location: "",
});
const selectedEvent = ref(null);
const showEventModal = ref(false);
const rsvpResponse = ref(null);

// Utility function to format datetime to ISO string with time zone info
const formatDateToISO = (dateStr, timeZone) => {
  const date = new Date(dateStr);
  // Adjust for the time zone offset if needed (this example assumes UTC conversion)
  if (timeZone === "CST") {
    date.setHours(date.getHours() - 6); // Adjust for CST (assuming no DST adjustments)
  } else if (timeZone === "PST") {
    date.setHours(date.getHours() - 8); // Adjust for PST
  }
  return date.toISOString(); // Send ISO format to the backend
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  editable: true,
  selectable: isAuthenticated,
  select: (info) => {
    // Prefill form with selected time
    showModal.value = true;
    eventForm.value.start = info.startStr; // for datetime-local input
    eventForm.value.end = info.endStr;
  },
  events: [
    {
      id: "m294f9m6ttfuj5oq1nd6rel51c",
      title: "Test",
      description: "test",
      start: "2025-04-04T13:18:00-05:00",
      end: "2025-04-05T13:18:00-05:00",
      timeZone: "UTC",
      location: "test",
    },
    {
      id: "1p9vi7eq8o5cm9ffvra3uki9t8",
      title: "Test",
      description: "Test",
      start: "2025-04-09T13:20:00-05:00",
      end: "2025-04-09T17:20:00-05:00",
      timeZone: "UTC",
      location: "Test",
    },
    {
      id: "ts15e3ffthkluf7hu6i3rhlggc",
      title: "Test with server protection but now authenticateda",
      description: "Test with server protection but now authenticateda",
      start: "2025-04-10T07:30:00-05:00",
      end: "2025-04-10T14:00:00-05:00",
      timeZone: "UTC",
      location: "Test with server protection but now authenticateda",
    },
    {
      id: "q942rkg7ibcgq5mb0k85nfj7f4",
      title: "Team Meeting",
      description: "Discussion about project progress and next steps.",
      start: "2025-04-10T10:00:00-05:00",
      end: "2025-04-10T11:00:00-05:00",
      timeZone: "America/Chicago",
      location: "Conference Room 1",
    },
    {
      id: "eu22onb882qbk29ofqgroq601s",
      title: "Test",
      description: "Test",
      start: "2025-04-10T11:30:00-05:00",
      end: "2025-04-10T14:00:00-05:00",
      timeZone: "UTC",
      location: "Test",
    },
    {
      id: "96qac9n4lt5mlfeklojc01ascc",
      title: "Team Meeting",
      description: "Discussion about project progress and next steps.",
      start: "2025-04-11T10:00:00-05:00",
      end: "2025-04-11T11:00:00-05:00",
      timeZone: "America/Chicago",
      location: "Conference Room 1",
    },
  ],
  eventClick: (info) => {
    selectedEvent.value = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      start: info.event.start,
      end: info.event.end,
      timeZone: info.event.extendedProps.timeZone,
      location: info.event.extendedProps.location,
    };
    showEventModal.value = true;
  },
});
onMounted(async () => {
  try {
    const events = await $fetch("/api/google/calendar");
    if (events) {
      calendarOptions.value.events = events;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
});

const handleEscapeKey = (e) => {
  if (e.key === "Escape") {
    showModal.value = false;
    showEventModal.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleEscapeKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscapeKey);
});

const submitEvent = async () => {
  try {
    // Format start and end time before sending the request
    const formattedStart = formatDateToISO(
      eventForm.value.start,
      eventForm.value.timeZone
    );
    const formattedEnd = formatDateToISO(
      eventForm.value.end,
      eventForm.value.timeZone
    );

    const newEvent = {
      ...eventForm.value,
      start: formattedStart,
      end: formattedEnd,
    };

    await $fetch("/api/google/calendar", {
      method: "POST",
      body: newEvent,
    });

    // Add event to calendar view
    calendarOptions.value.events.push({ ...newEvent });

    showModal.value = false;
    // Reset form
    eventForm.value = {
      title: "",
      description: "",
      start: "",
      end: "",
      timeZone: "UTC",
      location: "",
    };
  } catch (error) {
    console.error("Failed to submit event:", error);
  }
};

const respondToEvent = (response) => {
  rsvpResponse.value = response;
  console.log(`User responded: ${response}`);
};

watch(showEventModal, (newVal) => {
  if (newVal) {
    rsvpResponse.value = null; // Reset RSVP when modal opens
  }
});
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 95%;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.custom-event-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.event-btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #e8eaed;
  color: #3c4043;
}

.event-btn.yes {
  background-color: #e8f0fe;
}

.event-btn.no {
  background-color: #fce8e6;
}

.event-btn.selected.yes {
  background-color: #1a73e8;
  color: white;
}

.event-btn.selected.no {
  background-color: #d93025;
  color: white;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.rsvp-section {
  margin-top: 1.25rem;
  margin-bottom: 1rem;
}

.rsvp-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.rsvp-buttons {
  display: flex;
  gap: 1rem;
}

.event-btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.event-btn.no {
  background-color: #e8eaed;
  color: #3c4043;
}

.event-btn.yes:hover {
  background-color: #185abc;
}

.event-btn.no:hover {
  background-color: #d93025;
}
</style>
