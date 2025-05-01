<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6"
  >
    <div
      class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden font-sans"
    >
      <!-- Gradient header -->
      <div class="h-20 bg-[#FFE166] relative">
        <div class="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Title & metadata -->
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-800">
            {{ event?.title || "Loading…" }}
          </h1>
          <p v-if="!isLoading" class="text-sm text-gray-500">
            {{ formatDateTime(event.start) }} – {{ formatDateTime(event.end) }}
            <span
              class="ml-2 uppercase bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ event.timeZone }}
            </span>
          </p>
        </div>

        <!-- Description -->
        <p v-if="!isLoading" class="text-sm text-gray-700 leading-relaxed">
          {{ event.description }}
        </p>
        <div v-else class="text-center text-gray-500">Loading event…</div>

        <!-- Details grid -->
        <div
          v-if="!isLoading"
          class="grid grid-cols-2 gap-4 text-sm text-gray-600"
        >
          <div>
            <span class="font-medium text-gray-800">Location:</span><br />
            {{ event.location }}
          </div>
          <div>
            <span class="font-medium text-gray-800">Capacity:</span><br />
            {{ event.capacity ?? "N/A" }}
          </div>
          <div>
            <span class="font-medium text-gray-800">Going:</span><br />
            {{ event.currentCapacity ?? 0 }}
          </div>
          <div>
            <span class="font-medium text-gray-800">Tags:</span><br />
            <template v-if="event.tags?.length">
              <span
                v-for="tag in event.tags"
                :key="tag"
                class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-1 mb-1"
              >
                {{ tag }}
              </span>
            </template>
            <span v-else class="text-gray-400 italic">None</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200"></div>

        <!-- Who’s going -->
        <div v-if="!isLoading">
          <h2 class="text-sm font-medium text-gray-800 mb-2">People Going</h2>
          <ul class="space-y-2 max-h-32 overflow-y-auto pr-2">
            <li
              v-for="signup in event.signUps"
              :key="signup.id"
              class="flex items-center space-x-3 text-gray-700"
            >
              <div class="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div>
                <p class="font-medium">
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

        <!-- RSVP buttons -->
        <div class="mt-4 space-y-2">
          <p class="text-sm font-medium text-gray-800">Will you attend?</p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2 text-sm font-semibold rounded-full shadow-sm bg-green-200 hover:bg-green-300 transition"
              :class="{ 'bg-green-500 text-white': rsvpResponse === 'yes' }"
              :disabled="isResponding"
              @click="respondToEvent('yes')"
            >
              Yes
            </button>
            <button
              class="flex-1 py-2 text-sm font-semibold rounded-full shadow-sm bg-red-200 hover:bg-red-300 transition"
              :class="{ 'bg-red-500 text-white': rsvpResponse === 'no' }"
              :disabled="isResponding"
              @click="respondToEvent('no')"
            >
              No
            </button>
          </div>
        </div>

        <!-- Event ID -->
        <p v-if="!isLoading" class="text-[10px] text-gray-400 text-center">
          ID: {{ event.id }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "#imports";
import { fetchCombinedEventById } from "../server/utils/fetchCombinedEvents";
import { useRoute } from "vue-router";

const { data: user } = useAuth();
const route = useRoute();
const router = useRouter();
const eventId = route.params.id;

const event = ref(null);
const isLoading = ref(true); // NEW loading state
const rsvpResponse = ref(null);
const isResponding = ref(false); // disables buttons during RSVP API call
const userMap = ref({});

async function loadEvent() {
  try {
    const eventdata = await fetchCombinedEventById(eventId);
    console.log("Fetched Event:", eventdata);
    event.value = eventdata;

    if (event.value.signUps) {
      const userIds = [...new Set(eventdata.signUps.map((s) => s.userId))];
      console.log(userIds);
      const users = await $fetch("/api/user/batch", {
        method: "POST",
        body: { ids: userIds },
      });

      userMap.value = Object.fromEntries(users.map((u) => [u.id, u]));
    }
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
      isResponding.value = false;
    }, 1500);
  }
};
</script>
