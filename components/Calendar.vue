<template>
  <div class="calendar-container">
    <ClientOnly>
      <FullCalendar :options="calendarOptions" class="calendar z-10" />
    </ClientOnly>

    <Teleport to="body">
      <div>
        <ViewEvent @close-view-event-window="showEventWindow = false" @event-deleted="(id) => deleteEvent(id)" @event-edited="(e) => editEvent(e)" v-if="showEventWindow" :eventId="selectedEvent.id" />
      </div>

      <!-- Add Event Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      >
        <div
          class="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
        >
          <h3 class="text-xl font-bold mb-4 text-gray-800">Add Event</h3>
          <form @submit.prevent="submitEvent" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                v-model="eventForm.title"
                placeholder="Title"
                required
                class="input"
              />
              <input
                type="number"
                min="1"
                v-model="eventForm.capacity"
                placeholder="Capacity"
                required
                class="input"
              />
            </div>

            <textarea
              v-model="eventForm.description"
              placeholder="Description"
              rows="3"
              class="input w-full"
            ></textarea>

            <input
              v-model="eventForm.location"
              placeholder="Location"
              class="input w-full"
            />

            <Map :address="eventForm.location" />

            <!-- DELETE if we don't end up using google maps API  -->
            <!-- <Map @update:location="updateLocation" /> -->

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="text-sm text-gray-600">
                Start:
                <input
                  type="datetime-local"
                  :value="eventForm.start"
                  @input="eventForm.start = $event.target.value"
                  class="input w-full"
                />
              </label>
              <label class="text-sm text-gray-600">
                End:
                <input
                  type="datetime-local"
                  :value="eventForm.end"
                  @input="eventForm.end = $event.target.value"
                  class="input w-full"
                />
              </label>
            </div>

            <div class="flex justify-end gap-3 mt-4">
              <button
                type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
              <button
                @click="showModal = false"
                type="button"
                class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang='js'> // TODO: Should be lang='ts' but that for later
import { ref, computed } from "vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const router = useRouter();
import { authClient } from "~/server/auth"
const { data: session, status } = await authClient.getSession();
const userData = session.user;
console.log(session.value);
//const isAuthenticated = computed(() => status.value === "authenticated");
const showModal = ref(false);
const eventForm = ref({
  title: "",
  description: "",
  start: "",
  end: "",
  capacity: 0,
  location: "",
  address: "",
  lat: null,
  lng: null,
});

const selectedEvent = ref(null);
const rsvpResponse = ref(null);

const showEventWindow = ref(false);



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
  selectable:
    userData?.role === "ADMIN" || userData?.role === "SUPER" || false,
  select: (info) => {
    // Prefill form with selected time
    showModal.value = true;
    eventForm.value.start = info.startStr + "T12:00"; // for datetime-local input
    eventForm.value.end = info.endStr + "T12:00";
  },

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

    showEventWindow.value = true;
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
    showEventWindow.value = false;
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
    // Validation for location
    // if (!eventForm.value.location || eventForm.value.lat === null || eventForm.value.lng === null) {
    //   alert("Please select a valid location on the map before submitting.");
    //   return;
    // }
    if (!eventForm.value.location) {
      alert("Please enter a location.");
      return;
    }

const startTime = new Date(eventForm.value.start);
    const endTime = new Date(eventForm.value.end);
    const currentTime = new Date();
    
    if (startTime < currentTime) {
      alert("Event start time cannot be in the past. Please select a future date and time.");
      return;
    }

    if (endTime <= startTime) {
      alert("Event end time must be after the start time.");
      return;
    }
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

    const googleEvent = await $fetch("/api/google/calendar", {
      method: "POST",
      body: newEvent,
    });

    const { status } = await $fetch.raw("/api/event", {
      method: "POST",
      body: {
        id: googleEvent.id,
        title: newEvent.title,
        description: newEvent?.description,
        userId: userData?.id || "-1",
        eventLat: newEvent?.lat,
        eventLong: newEvent?.lng,
        location: newEvent.location,
        startTime: new Date(newEvent?.start),
        endTime: new Date(newEvent?.end),
        capacity: newEvent?.capacity,
      },
    });

    if (status != 200) {
      const deleteGoogleEvent = await $fetch(`/api/google/calendar/${googleEvent.id}`, {
        method: 'DELETE'
      })
      console.log(deleteGoogleEvent)
    }

    // Add event to calendar view
    calendarOptions.value.events.push({
      id: googleEvent.id,
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      location: newEvent.location,
      timeZone: newEvent.timeZone,
    });
   
    showModal.value = false;
    // Reset form
    eventForm.value = {
      title: "",
      description: "",
      start: "",
      end: "",
      timeZone: "UTC",
      location: "",
      lat: null,
      lng: null,
    };
  } catch (error) {
    console.error("Failed to submit event:", error);
  }
};

const respondToEvent = async (response) => {
  rsvpResponse.value = response;

  const userId = userData.id; // Replace with actual user ID from auth
  const eventId = selectedEvent.value.id;

  if (response === "yes") {
    try {
      const result = await $fetch("/api/signup", {
        method: "POST",
        body: {
          userId,
          eventId,
          notifications: true, // or false based on your UI
        },
      });
      console.log("RSVP success:", result);
    } catch (err) {
      console.error("RSVP failed:", err);
    }
  } else if (response === "no") {
    try {
      // Step 1: Get the signup ID
      const signup = await $fetch(`/api/signup/lookup`, {
        method: "POST",
        body: {
          userId,
          eventId,
        },
      });

      if (!signup || !signup.id) {
        console.warn("No RSVP found to remove.");
        return;
      }

      // Step 2: Delete the RSVP using the ID
      const result = await $fetch(`/api/signup/${signup.id}`, {
        method: "DELETE",
      });

      console.log("RSVP removed successfully:", result);
    } catch (err) {
      console.error("Failed to remove RSVP:", err);
    }
  }
};

function updateLocation(location) {
  eventForm.value.lat = location.lat;
  eventForm.value.lng = location.lng;

  // If we have a name/address from Autocomplete, use them.
  if (location.name || location.address) {
    eventForm.value.location = location.name || location.address || "";
    eventForm.value.address = location.address || "";
  } else {
    // If no name/address, default to coordinates
    const coordsString = `Lat: ${location.lat.toFixed(
      6
    )}, Lng: ${location.lng.toFixed(6)}`;
    eventForm.value.location = coordsString;
    eventForm.value.address = coordsString;
  }
}

// given an id of an event, deletes event from the list
function deleteEvent(deleteId) {

  // search through events in event list. if event id matches, then delete it from the list
  for (let i = 0; i < calendarOptions.value.events.length; i++)
  {
    if (calendarOptions.value.events[i].id == deleteId)
    {
      calendarOptions.value.events.splice(i, 1);
      break;
    }
  }
}

// given an edited version of an event, edit the event in the list
function editEvent(newEvent) {
  console.log(newEvent);
  for (let i = 0; i < calendarOptions.value.events.length; i++)
    {
      if (calendarOptions.value.events[i].id == newEvent.id)
      {
          calendarOptions.value.events[i] = newEvent;
          break;
      }
    }
}
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
  max-height: 90vh;
  overflow-y: scroll;
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
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-content input,
.form-content textarea,
.form-content select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-content h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.25rem;
  color: #333;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.horizontal-modal {
  width: 90%;
  max-width: 900px;
}

.form-horizontal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

textarea {
  flex: 1;
  min-width: 100%;
  resize: vertical;
}

input,
select,
label {
  flex: 1;
  min-width: 200px;
}

.modal-actions {
  justify-content: flex-end;
}
</style>
