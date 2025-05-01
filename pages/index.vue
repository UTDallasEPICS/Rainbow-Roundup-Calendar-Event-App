<template>
  <div
    class="min-h-screen bg-gray-100 w-full flex flex-col items-center justify-center px-4 md:px-8"
  >
    <div class="w-full max-w-6xl space-y-8 py-8">
      <!-- Greeting -->
      <header class="text-center">
        <h1 class="text-xl md:text-2xl font-bold text-zinc-700 capitalize">
          Helloiausdisagd {{ user?.firstname || "" }}!
        </h1>
      </header>

      <!-- Calendar Section -->
      <div class="text-center">
        <div
          class="text-xs md:text-sm font-extrabold uppercase text-zinc-700 mb-2"
        >
          Your Calendar
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-6"
      >
        <!-- Calendar Grid -->
        <div class="w-full md:w-2/3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-semibold">May 2025</h2>
            <button
              @click="showEvents = !showEvents"
              class="text-sm text-blue-600 underline hover:text-blue-800 transition"
            >
              {{ showEvents ? "Hide" : "Show" }} Events
            </button>
          </div>

          <div
            class="grid grid-cols-7 gap-2 text-center text-sm text-gray-700 font-semibold mb-2"
          >
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div class="grid grid-cols-7 gap-2 text-center">
            <template v-for="day in 31" :key="day">
              <div
                class="h-20 border rounded-lg p-2 hover:bg-blue-100 cursor-pointer flex flex-col items-start"
              >
                <span class="text-sm font-bold text-gray-700">{{ day }}</span>
                <div class="text-xs text-blue-500 truncate w-full">+ Event</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Events Panel -->
        <div
          v-show="showEvents"
          class="w-full md:w-1/3 bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-300 ease-in-out"
        >
          <h3 class="text-lg font-semibold mb-3">Events for May 15</h3>
          <ul class="space-y-2 text-sm">
            <li class="p-2 rounded bg-white border border-gray-200">
              <p class="font-medium">Team Meeting</p>
              <p class="text-gray-600">10:00 AM - 11:00 AM</p>
            </li>
            <li class="p-2 rounded bg-white border border-gray-200">
              <p class="font-medium">Lunch w/ Client</p>
              <p class="text-gray-600">1:00 PM - 2:00 PM</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Admin Section -->
      <div
        v-if="user && (user.role === 'ADMIN' || user.role === 'SUPER')"
        class="text-center space-y-2"
      >
        <div class="text-xs font-extrabold uppercase text-zinc-700">
          Manage Users
        </div>
        <NuxtLink
          to="/admin/userList"
          class="bg-lime-300 text-zinc-600 text-xs font-extrabold uppercase px-4 py-2 rounded-full inline-block"
        >
          All Users
        </NuxtLink>
      </div>

      <!-- Events Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-md font-extrabold uppercase text-zinc-700">
          Upcoming Events
        </div>
        <div class="flex gap-2">
          <NuxtLink
            to="/eventsPage"
            class="bg-white text-zinc-600 text-xs font-semibold capitalize px-4 py-1 rounded-full border border-zinc-600"
          >
            See All
          </NuxtLink>
          <NuxtLink
            to="/calendar"
            v-if="user && (user.role === 'ADMIN' || user.role === 'SUPER')"
          >
            <button
              class="bg-white/50 text-green-600 text-xs px-4 py-1 rounded-full border border-green-600"
            >
              New
            </button>
          </NuxtLink>
        </div>
      </div>

      <!-- Event Cards Scrollable -->
      <div class="overflow-x-auto flex space-x-4 py-4 snap-x snap-mandatory">
        <EventCard
          v-for="e in events"
          :key="e.id"
          v-bind="e"
          class="snap-start flex-shrink-0"
          @expand="openEditForm(e)"
          @update:saved="e.saved = $event"
        />
      </div>

      <!-- Event Form Modal -->
      <teleport to="body">
        <div
          v-if="showForm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <MakeEventCard
            v-model="editingEvent"
            @save="onSaveEvent"
            @cancel="showForm = false"
          />
        </div>
      </teleport>

      <!-- Image Gallery -->
      <div class="text-md font-extrabold uppercase text-zinc-700">
        Image Gallery
      </div>
      <div
        ref="gallery"
        @scroll="onScroll"
        class="w-full overflow-x-auto flex space-x-4 snap-x snap-mandatory scrollbar-none"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="flex-shrink-0 w-64 sm:w-80 h-56 bg-amber-300 rounded-[20px] shadow-md snap-start flex items-center justify-center"
        >
          Placeholder {{ n }}
        </div>
      </div>

      <!-- Support Cards Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Support Families -->
        <div class="relative h-28 rounded-[20px] shadow-md bg-lime-300 p-4">
          <div class="text-slate-900 text-lg font-medium">
            Support our Families!
          </div>
          <div class="text-slate-600 text-xs mt-2">somethingsomething</div>
          <a
            href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
            target="_blank"
            rel="noopener noreferrer"
            class="absolute left-4 bottom-2 w-16 h-8 bg-lime-600 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center"
          >
            Donate
          </a>
        </div>

        <!-- Our Mission -->
        <div class="relative h-28 rounded-[20px] shadow-md bg-blue-300 p-4">
          <div class="text-slate-900 text-lg font-medium">Our Mission</div>
          <div class="text-slate-600 text-xs mt-2">somethingsomething</div>
          <button
            class="absolute left-4 bottom-2 w-16 h-8 bg-slate-500 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center"
          >
            Read
          </button>
        </div>

        <!-- Merchandise -->
        <div
          class="relative h-28 rounded-[20px] shadow-md bg-fuchsia-400 p-4 col-span-full sm:col-span-1"
        >
          <div class="text-white text-lg font-medium">Buy our Merchandise!</div>
          <div class="text-white text-xs mt-2">somethingsomething</div>
          <button
            class="absolute left-4 bottom-2 w-16 h-8 bg-fuchsia-800 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center"
          >
            Buy
          </button>
        </div>
      </div>

      <!-- Sponsors -->
      <div class="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div class="text-xl font-bold text-zinc-700 capitalize">
          Our Sponsors
        </div>
        <a
          href="https://rrup.org/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-white text-zinc-600 text-xs font-semibold capitalize px-4 py-1 rounded-full border border-zinc-600"
        >
          Become a Sponsor
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";

// Components
import EventCard from "@/components/EventCard.vue";
import MakeEventCard from "@/components/MakeEventCard.vue";
import { fetchCombinedEvents } from "../server/utils/fetchCombinedEvents";

// Auth (optional based on your code)
const { status, data, refresh } = useAuth();
await refresh();
const user = computed(() => data.value?.user);
console.log(user);
const showEvents = ref(false);
interface EventItem {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  location: string;
  saved: boolean;
  avatars: string[];
  going: number;
}

// Reactive state
const images = [
  "/images/ProfileImage.png",
  "/images/backArrow.png",
  "/images/ProfileImage.png",
];
const currentIndex = ref(0);
const intervalId = ref<number | null>(null);
const events = ref<EventItem[]>([]);

// Event form state
const showForm = ref(false);
const editingEvent = ref<any>(null);

onMounted(async () => {
  try {
    const data = await fetchCombinedEvents();
    console.log("Fetched data:", data);

    events.value = data.map((event) => {
      const date = new Date(event.start); // assuming event.start is ISO string

      const dateDay = date.getDate().toString(); // "15", "30", etc.
      const dateMonth = date.toLocaleString("default", { month: "short" }); // "May", "Jun", etc.

      return {
        ...event,
        dateDay,
        dateMonth,
        avatars: [
          "https://placehold.co/24x24",
          "https://placehold.co/24x24",
          "https://placehold.co/24x24",
        ],
        going: Math.floor(Math.random() * 50) + 1,
        saved: false,
      };
    });
  } catch (err: any) {
    console.error("Error fetching events:", err);
    err.value = err.message;
  }
});

// Auto-play logic
function startAutoPlay() {
  intervalId.value = window.setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopAutoPlay() {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % images.length;
}

// New Event Form logic
function openNewEventForm() {
  editingEvent.value = null;
  showForm.value = true;
}

function openEditForm(event: any) {
  editingEvent.value = { ...event };
  showForm.value = true;
}

function onSaveEvent(savedEvent: any) {
  if (editingEvent.value) {
    // Editing existing event
    const index = events.value.findIndex((e) => e.id === savedEvent.id);
    if (index !== -1) {
      events.value[index] = savedEvent;
    }
  } else {
    // Adding new event
    events.value.push({
      ...savedEvent,
      id: Date.now(),
      saved: false,
    });
  }
  showForm.value = false;
}

function onExpand(event: any) {
  console.log("Expanded event", event);
}

function onScroll(event: Event) {
  // You can handle custom scroll behavior here if needed
}

onMounted(() => {
  startAutoPlay();
});

onBeforeUnmount(() => {
  stopAutoPlay();
});
</script>
