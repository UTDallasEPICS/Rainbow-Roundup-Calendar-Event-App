<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 font-sans"
  >
    <div
      class="w-full max-w-lg bg-white rounded-2xl shadow-md overflow-hidden relative"
    >
      <!-- Edit/Save/Cancel Controls -->
      <div
        class="absolute top-4 right-4 flex space-x-2 z-10"
        v-if="['ADMIN', 'SUPER'].includes(user?.user?.role)"
      >
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Edit
        </button>
        <template v-else>
          <button
            @click="saveChanges"
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
              @click="respondToEvent('yes')"
              :class="[
                'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                userRSVP === 'yes'
                  ? 'bg-green-400 text-white'
                  : 'bg-green-200 hover:bg-green-300',
              ]"
            >
              Yes
            </button>
            <button
              @click="respondToEvent('no')"
              :class="[
                'flex-1 py-2 text-sm font-semibold rounded-full shadow-sm transition',
                userRSVP === 'no'
                  ? 'bg-red-400 text-white'
                  : 'bg-red-200 hover:bg-red-300',
              ]"
            >
              No
            </button>
          </div>
        </div>

        <!-- Event ID -->
        <p v-if="!isLoading" class="text-[10px] text-gray-400 text-center">
          ID: {{ event.id }}
        </p>

        <!-- Delete at bottom -->
        <div v-if="isEditing" class="mt-6">
          <button
            @click="deleteEvent"
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

// State
const isEditing = ref(false);
const editedEvent = reactive({
  title: "",
  description: "",
  location: "",
  capacity: null,
});
const isResponding = ref(false);
const rsvpResponse = ref(null);

// Auth & routing
const { data: user } = useAuth();

const route = useRoute();
const router = useRouter();
const eventId = route.params.id;

// Event data
const event = ref(null);
const isLoading = ref(true);
const userMap = ref({});

// Derived formatted date
const formattedSelectedDate = computed(() =>
  event.value
    ? new Date(event.value.start).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""
);

// Load and initialize
async function loadEvent() {
  try {
    const eventdata = await fetchCombinedEventById(eventId);
    event.value = eventdata;
    Object.assign(editedEvent, {
      title: eventdata.title,
      description: eventdata.description,
      location: eventdata.location,
      capacity: eventdata.capacity,
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
    isLoading.value = false;
  }
}

onMounted(loadEvent);

// Actions
const toggleEdit = () => (isEditing.value = true);
const saveChanges = () => {
  console.log("Saving edits:", editedEvent);
  isEditing.value = false;
};
const cancelEdit = () => {
  // revert edits
  Object.assign(editedEvent, {
    title: event.value.title,
    description: event.value.description,
    location: event.value.location,
    capacity: event.value.capacity,
  });
  isEditing.value = false;
};
const deleteEvent = () => {
  console.log("Deleting event", event.value.id);
};

// added in navigation to user profile function
const navigateToUserProfile = (userId) => {
  if (userId) {
    router.push(`/user/${userId}`);
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
    await loadEvent();
  } catch (err) {
    console.error("RSVP action failed:", err);
  } finally {
    setTimeout(() => {
      isResponding.value = false;
    }, 1500);
  }
};
</script>