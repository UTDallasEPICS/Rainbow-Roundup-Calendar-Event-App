<!-- 24 sep 2025
    a modal window that lets all users see an event's details. used in /calendar and /eventsPage. it should let SUPER and ADMIN edit and/or delete events
-->

<template>
  <!-- Background -->
    <div
        class="fixed top-0 right-0 z-30 h-full w-full bg-black/70 backdrop-blur-sm"
    ></div>
    

<!-- window -->
    <div
    class="fixed top-0 right-0 z-40 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto"
    >
    <div
      class="z-40 w-full max-w-5xl bg-white rounded-2xl shadow-md relative overflow-auto max-h-[70vh]"
    >
    <div class="absolute top-4 right-4 flex space-x-2 z-10">
        <!-- Edit/Save/Cancel Controls -->
        <div
            v-if="['ADMIN', 'SUPER'].includes(user?.user?.role)"
        >
            <button
            v-if="!isEditing"
            @click="toggleEdit"
            class="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-1"
            >
            Edit
            </button>
            <template v-else>
            <button
                @click="saveChanges()"
                class="bg-indigo-600 text-white px-4 py-1 rounded-full hover:bg-indigo-700 transition"
            >
                Save
            </button>
            <button
                @click="cancelEdit"
                class="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-full transition"
            >
                Cancel
            </button>
            </template>
        </div>
        <button @click="closeWindow()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5"
              stroke="currentColor" class="w-4 h-4"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/> </svg>
        </button>
      </div>

      <!-- Gradient header -->
      <div class="h-20 bg-[#FFE166] relative">
        <div class="absolute inset-0 opacity-10" />
      </div>

      <div class="p-6 space-y-6">
        <!-- Title & metadata -->
        <div class="space-y-1">
          <div v-if="!isEditing">
            <h1 class="text-2xl font-semibold text-gray-800">
              {{ event?.title || "Loading…" }}
            </h1>
          </div>
          <div v-else>
            <input
              v-model="editedEvent.title"
              class="w-full text-2xl font-semibold text-gray-800 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <p v-if="!isLoading && !isEditing" class="text-sm text-gray-500">
            {{ formatDateTime(event.start) }} – {{ formatDateTime(event.end) }}
            <span
              class="ml-2 uppercase bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ event.timeZone }}
            </span>
          </p>
          <div v-else-if="!isLoading" class="flex text-sm">
            <!-- start -->
            <div class="flex-initial pr-2">
                <div class="row-span-1 font-medium text-gray-800">Start:</div>
                <input
                  type="datetime-local"
                  v-model="editedEvent.startTime"
                  class="input w-full row-span-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 p-1"
                />
            </div>
            <div class="flex-initial px-2">
                <div class="row-span-1 font-medium text-gray-800">End:</div>
                <input
                  type="datetime-local"
                  v-model="editedEvent.endTime"
                  class="input w-full row-span-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 p-1"
                />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div
          v-if="!isLoading && !isEditing"
          class="text-sm text-gray-700 leading-relaxed"
        >
          {{ event.description }}
        </div>
        <div v-else-if="isEditing">
          <textarea
            v-model="editedEvent.description"
            rows="4"
            class="w-full text-sm text-gray-700 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div v-else class="text-center text-gray-500">Loading event…</div>

        <!-- Details grid -->
        <div
          v-if="!isLoading"
          class="grid grid-cols-2 gap-4 text-sm text-gray-600"
        >
          <div>
            <span class="font-medium text-gray-800">Location:</span><br />
            <span v-if="!isEditing">{{ event.location }}</span>
            <input
              v-else
              v-model="editedEvent.location"
              class="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 mt-1"
            />
          </div>
          <div>
            <span class="font-medium text-gray-800">Capacity:</span><br />
            <span v-if="!isEditing"
              >{{ event.currentCapacity ?? "N/A" }}/{{
                event.capacity ?? "N/A"
              }}</span
            >
            <input
              v-else
              type="number"
              v-model.number="editedEvent.capacity"
              class="w-full border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 mt-1"
            />
          </div>
        </div>

        <!-- Map -->
        <div v-if="!isLoading && isEditing">
            <Map @update:location="updateLocation" />
        </div>

        <div v-if="!isLoading && !isEditing">
            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Who's going: tried to make clickable -->
            <div v-if="!isLoading">
            <h2 class="text-sm font-medium text-gray-800 mb-2">People Going</h2>
            <ul class="space-y-2 max-h-32 overflow-y-auto pr-2 text-gray-700">
                <li
                v-for="signup in event.signUps"
                :key="signup.id"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                @click="navigateToUserProfile(signup.userId)"
                >
                <img
                    :src="
                    userMap[signup.userId]?.profilePic || '/default-profile.png'
                    "
                    alt="Profile"
                    class="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div>
                    <p class="font-medium text-indigo-600 hover:text-indigo-800">
                    {{ userMap[signup.userId]?.firstname || "Unknown" }}
                    {{ userMap[signup.userId]?.lastname || "" }}
                    </p>
                    <p class="text-xs text-gray-500">
                    {{ userMap[signup.userId]?.email || "No email" }}
                    </p>
                </div>
                </li>
                <li v-if="!event.signUps.length" class="text-gray-400 italic">
                No one has signed up yet.
                </li>
            </ul>
            </div>

            <div class="mt-4 space-y-2">
            <p class="text-sm font-medium text-gray-800">Will you attend?</p>
            <div class="flex gap-3">
                <button
                @click="rsvpClickResponse('yes')"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    rsvpChoice === 'yes'
                    ? 'bg-green-400 text-white'
                    : 'bg-green-200 hover:bg-green-300',
                ]"
                >
                Yes
                </button>
                <button
                @click="rsvpClickResponse('no')"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    rsvpChoice === 'no'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-200 hover:bg-red-300',
                ]"
                >
                No
                </button>
            </div>
            <div v-if="rsvpChoice ==  'yes'" class="gap-3">
              <label class="block mt-4 text-sm font-medium text-gray-700">How many other people are going to join you?</label>
                <div class="flex space-x-6 mt-1 border-solid border-gray-700">
                  <input
                  type="number"
                  id="numPlusOne"
                  v-model.number="numPlusOne"
                  :min="0"
                  />
                </div>
            </div>
            <div v-if="rsvpChoice" class="flex gap-3">
              
                <button
                @click="respondToEvent(rsvpChoice)"
                :class="[
                    'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                    userRSVP === 'yes'
                    ? 'bg-blue-400 text-white'
                    : 'bg-blue-200 hover:bg-blue-300',
                ]"
                >
                Save
                </button>
            </div>
            
            </div>
        </div>
        <!-- Event ID -->
        <p v-if="!isLoading" class="text-[10px] text-gray-400 text-center">
          ID: {{ event.id }}
        </p>

        <!-- Delete at bottom -->
        <div v-if="isEditing" class="mt-6">
          <button
            @click="deleteEvent()"
            class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuth } from "#imports"; // todo: figure out why useAuth is called here or if we don't need to touch it. 
import { fetchCombinedEventById } from "../server/utils/fetchCombinedEvents";
import { useRoute, useRouter } from "vue-router";
import { Size } from "@prisma/client";

const props = defineProps(['eventId']);
const emit = defineEmits(["closeViewEventWindow", "eventDeleted", "eventEdited"]);
function closeWindow() {
    emit("closeViewEventWindow");
}

// State
const rsvpChoice = ref('');
const numPlusOne = ref(0);
const isEditing = ref(false);
const editedEvent = reactive({
  id: props.eventId,
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  capacity: 0,
  location: "",
  address: "",
  eventLat: null,
  eventLong: null,
});
const isResponding = ref(false);
const rsvpResponse = ref(null);

// Auth & routing
const { data: user } = useAuth();

const route = useRoute();
const router = useRouter();
const eventId = props.eventId;

// Event data
const event = ref(null);
const isLoading = ref(true);
const userMap = ref({});

// get local time string for edited events
function toLocalISOString(date) {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
  return localISOTime.slice(0, 16);
}

// Load and initialize
async function loadEvent() {
  try {
    const eventdata = await fetchCombinedEventById(eventId);
    event.value = eventdata;
    const startTime = new Date(eventdata.start);
    const endTime = new Date(eventdata.end);

    Object.assign(editedEvent, {
      title: eventdata.title,
      description: eventdata.description,
      startTime: toLocalISOString(startTime),
      endTime: toLocalISOString(endTime),
      capacity: eventdata.capacity,
      location: eventdata.location,
      address: eventdata.address,
      eventLat: eventdata.lat,
      eventLong: eventdata.lng,
    });


    if (eventdata.signUps?.length) {
      const ids = [...new Set(eventdata.signUps.map((s) => s.userId))];
      const users = await $fetch("/api/user/batch", {
        method: "POST",
        body: { ids },
      });
      userMap.value = Object.fromEntries(users.map((u) => [u.id, u]));
    }
  } catch (e) {
    console.error("Load failed", e);
  } finally {
    console.log("Load complete. Edited event:", editedEvent)
    isLoading.value = false;
  }
}

onMounted(loadEvent);

// Actions
const toggleEdit = () => (isEditing.value = true);

async function saveChanges() {
    // Validation for location
    if (!editedEvent.location || editedEvent.eventLat === null || editedEvent.eventLong === null) {
        alert("Please select a valid location on the map before submitting.");
        return;
    }
    // validation for time
    const startTime = new Date(editedEvent.startTime);
    const endTime = new Date(editedEvent.endTime);
    const currentTime = new Date();
    
    if (startTime < currentTime) {
      alert("Event start time cannot be in the past. Please select a future date and time.");
      return;
    }

    if (endTime <= startTime) {
      alert("Event end time must be after the start time.");
      return;
    }

    // assign new event values
    event.value.title = editedEvent.title;
    event.value.description = editedEvent.description;
    event.value.start = startTime.toISOString();
    event.value.end = endTime.toISOString();
    event.value.capacity = editedEvent.capacity;
    event.value.location = editedEvent.location;
    event.value.address = editedEvent.address;
    event.value.lat = editedEvent.eventLat;
    event.value.lng = editedEvent.eventLong;

    const { error : localPutError } = await useFetch(`../api/event/${eventId}`, {
        method: "PUT",
        body: event.value,
    });
    if (localPutError.value) {
        console.error("Local database PUT error:", localPutError.value);
    }
    
    const { error : googlePutError } = await useFetch(`../api/google/calendar/${eventId}`, {
        method: "PUT",
        body: event.value,
    });
    if (googlePutError.value) {
        console.error("Google database PUT error:", googlePutError.value);
    }

    isEditing.value = false;
    emit("eventEdited", event.value);
};
const cancelEdit = () => {
  // revert edits
  const startTime = new Date(event.value.start);
  const endTime = new Date(event.value.end);

  Object.assign(editedEvent, {
    title: event.value.title,
    description: event.value.description,
    startTime: toLocalISOString(startTime),
    endTime: toLocalISOString(endTime),
    capacity: event.value.capacity,
    location: event.value.location,
    address: event.value.address,
    eventLat: event.value.lat,
    eventLong: event.value.lng,
  });
  isEditing.value = false;
};
async function deleteEvent() {

  // delete event on the database side
  const { error : localDeleteError } = await useFetch(`../api/event/${eventId}`, {
      method: "DELETE",
      body: event.value.id,
  });

  if (localDeleteError.value) {
    console.error("Local database DELETE error:", localDeleteError.value);
  }

  // delete event on the google calendar side
  const { error : googleDeleteError } = await useFetch(`../api/google/calendar/${eventId}`, {
      method: "DELETE",
      body: event.value.id,
  });

  if (googleDeleteError.value) {
    console.error("Google calendar DELETE error:", googleDeleteError.value);
  }

  console.log("Event deleted");
  emit("eventDeleted", event.value.id);
  emit("closeViewEventWindow");
  

};

// added in navigation to user profile function
const navigateToUserProfile = (userId) => {
  if (userId) {
    router.push(`/profile/${userId}`);
  }
};

// Formatting helper
function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const userRSVP = computed(() => {
  const userId = user.value?.user?.id;
  if (!userId || !event.value?.signUps) return null;

  return event.value.signUps.some((s) => s.userId === userId) ? "yes" : "no";
});
const rsvpClickResponse = async (response) => {
  rsvpChoice.value = response;
  //console.log('User click: ',rsvpChoice);
  return;
}
const rsvpChoiceVal = computed(() => {
  return rsvpChoice;
});

const respondToEvent = async (response) => {
  if (isResponding.value) return; // Prevent spamming by blocking clicks
  isResponding.value = true;

  if (!user.value || !user.value.user?.id) {
    router.push("/login"); // Or use router.push("/") if using Vue Router directly
  }

  rsvpResponse.value = response;
  console.log(`User responded: ${response}`);

  const userId = user.value?.user.id;
  const eventId = event.value?.id;

  if (!userId || !eventId) {
    console.error("Missing userId or eventId.");
    isResponding.value = false;
    return;
  }

  try {
    if (response === "yes") {
      const result = await $fetch("/api/signup", {
        method: "POST",
        body: { userId, eventId },
      });
      //console.log("Number of plus one's: ", numPlusOne.value)
      console.log("RSVP success:", result);
    } else if (response === "no") {
      console.log(userId);
      console.log(eventId);
      const signup = await $fetch("/api/signup/lookup", {
        method: "GET",
        query: { userId, eventId },
      });
      if (!signup || !signup.signUp.id) {
        console.warn("No RSVP found to remove.");
      } else {
        const result = await $fetch(`/api/signup/${signup.signUp.id}`, {
          method: "DELETE",
        });
        console.log("RSVP removed successfully:", result);
      }
    }
    rsvpChoice.value = '';
    await loadEvent();
  } catch (err) {
    console.error("RSVP action failed:", err);
  } finally {
    setTimeout(() => {
      isResponding.value = false;
    }, 1500);
  }
};

function updateLocation(location) {
  editedEvent.eventLat = location.lat;
  editedEvent.eventLong = location.lng;

  // If we have a name/address from Autocomplete, use them.
  if (location.name || location.address) {
    editedEvent.location = location.name || location.address || "";
    editedEvent.address = location.address || "";
  } else {
    // If no name/address, default to coordinates
    const coordsString = `Lat: ${location.lat.toFixed(
      6
    )}, Lng: ${location.lng.toFixed(6)}`;
    editedEvent.location = coordsString;
    editedEvent.address = coordsString;
  }
}
</script>

