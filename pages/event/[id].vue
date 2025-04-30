<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-8">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <!-- If loading -->
      <div v-if="isLoading" class="text-center text-gray-500">
        Loading event...
      </div>

      <!-- If loaded -->
      <div v-else-if="event">
        <h1 class="text-2xl font-bold text-gray-800">{{ event.title }}</h1>

        <div class="space-y-2 text-gray-600 text-sm">
          <div>
            <span class="font-semibold">Description:</span>
            {{ event.description }}
          </div>
          <div>
            <span class="font-semibold">Location:</span> {{ event.location }}
          </div>
          <div>
            <span class="font-semibold">Capacity:</span>
            {{ event.capacity ?? "N/A" }}
          </div>
          <div>
            <span class="font-semibold">Current Going:</span>
            {{ event.currentCapacity ?? 0 }}
          </div>
          <div>
            <span class="font-semibold">Start:</span>
            {{ formatDateTime(event.start) }}
          </div>
          <div>
            <span class="font-semibold">End:</span>
            {{ formatDateTime(event.end) }}
          </div>
          <div>
            <span class="font-semibold">Timezone:</span> {{ event.timeZone }}
          </div>
          <div>
            <span class="font-semibold">Tags:</span>
            {{ event.tags?.join(", ") || "None" }}
          </div>

          <!-- 🧑‍🤝‍🧑 List of Users Going -->
          <div v-if="event.signUps && event.signUps.length" class="pt-4">
            <span class="font-semibold">People Going:</span>
            <ul class="list-disc list-inside text-gray-700 mt-2">
              <li v-for="signup in event.signUps" :key="signup.id">
                {{ signup.id }} {{ signup.user?.lastname }} ({{
                  signup.user?.email
                }})
              </li>
            </ul>
          </div>
          <div v-else class="pt-4 text-gray-400 italic">
            No one has signed up yet.
          </div>
        </div>

        <!-- RSVP Section -->
        <div class="rsvp-section pt-6">
          <p class="rsvp-label font-semibold text-gray-700">Are you going?</p>
          <div class="rsvp-buttons flex gap-4 pt-2">
            <button
              class="event-btn px-4 py-2 rounded bg-green-200"
              :class="{ 'selected bg-green-400': rsvpResponse === 'yes' }"
              :disabled="isResponding"
              @click="respondToEvent('yes')"
            >
              Yes
            </button>
            <button
              class="event-btn px-4 py-2 rounded bg-red-200"
              :class="{ 'selected bg-red-400': rsvpResponse === 'no' }"
              :disabled="isResponding"
              @click="respondToEvent('no')"
            >
              No
            </button>
          </div>
        </div>

        <div class="text-xs text-gray-400 pt-4">Event ID: {{ event.id }}</div>
      </div>

      <!-- Optional: If event failed to load -->
      <div v-else class="text-center text-red-500">Failed to load event.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "#imports";
import { fetchCombinedEventById } from "../server/utils/fetchCombinedEvents";

const { data: user } = useAuth();
const event = ref(null);
const isLoading = ref(true); // NEW loading state
const rsvpResponse = ref(null);
const isResponding = ref(false); // disables buttons during RSVP API call

async function loadEvent() {
  try {
    const eventdata = await fetchCombinedEventById(
      "6tneot2ng4ibl6b0pprfke0nvk"
    );
    console.log("Fetched Event:", eventdata);
    event.value = eventdata;
  } catch (error) {
    console.error("Failed to fetch event:", error);
  } finally {
    isLoading.value = false; // whether success or error, stop loading
  }
}

onMounted(() => {
  loadEvent();
});

function formatDateTime(isoString) {
  if (!isoString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(isoString).toLocaleString("en-US", options);
}

const respondToEvent = async (response) => {
  if (isResponding.value) return; // Prevent spamming by blocking clicks
  isResponding.value = true;

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
        body: { userId, eventId, notifications: true },
      });
      console.log("RSVP success:", result);
    } else if (response === "no") {
      const signup = await $fetch("/api/signup/lookup", {
        method: "POST",
        body: { userId, eventId },
      });

      if (!signup || !signup.id) {
        console.warn("No RSVP found to remove.");
      } else {
        const result = await $fetch(`/api/signup/${signup.id}`, {
          method: "DELETE",
        });
        console.log("RSVP removed successfully:", result);
      }
    }
  } catch (err) {
    console.error("RSVP action failed:", err);
  } finally {
    setTimeout(() => {
      isResponding.value = false; // add a slight delay before re-enabling
    }, 1500); // ⏱️ 1.5 seconds delay
  }
};
</script>
