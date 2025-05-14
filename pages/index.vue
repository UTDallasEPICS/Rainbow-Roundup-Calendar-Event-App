<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-8"
  >
    <div class="w-full max-w-6xl space-y-8 py-8">
      <!-- Greeting -->
      <header class="flex items-center space-x-4">
        <img
          :src="user?.profilePic || '/default-profile.png'"
          alt="Profile"
          class="w-10 h-10 rounded-full object-cover"
          v-if="user"
        />
        <h1 class="text-xl md:text-2xl font-bold text-zinc-700 capitalize">
          Hello {{ user?.firstname || "" }}!
        </h1>
      </header>

      <!-- Calendar Section -->
      <div>
        <div class="text-sm md:text-md font-extrabold uppercase text-zinc-700">
          Your Event Calendar
        </div>
      </div>
      <CalendarSection :events="events" />

      <!-- Admin Section -->
      <div
        v-if="user && (user.role === 'ADMIN' || user.role === 'SUPER')"
        class="space-y-2"
      >
        <div class="text-sm md:text-md font-extrabold uppercase text-zinc-700">
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
      <div class="flex flex-col flex-wrap gap-4">
        <div class="text-sm md:text-md font-extrabold uppercase text-zinc-700">
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
          v-for="(img, index) in imageRefs"
          :key="index"
          class="flex-shrink-0 w-64 sm:w-80 h-56 bg-amber-300 rounded-[20px] shadow-md snap-start flex items-center justify-center overflow-hidden"
        >
          <img
            :src="img"
            alt="Card image"
            class="object-cover w-full h-full rounded-[20px]"
          />
        </div>
      </div>

      <!-- Support Cards Section -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Support Families -->
        <div class="relative h-28 rounded-[20px] shadow-md bg-lime-300 p-4">
          <div class="text-slate-900 text-lg font-medium">
            Support our Families!
          </div>
          <div class="text-slate-600 text-xs mt-2">
            Your kindness makes a difference.
          </div>
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
          <div class="text-slate-600 text-xs mt-2">
            Learn how we're changing lives.
          </div>
          <NuxtLink to="/aboutUs">
            <button
              class="absolute left-4 bottom-2 w-16 h-8 bg-slate-500 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center"
            >
              Read
            </button>
          </NuxtLink>
        </div>

        <!-- Merchandise -->
        <div
          class="relative h-28 rounded-[20px] shadow-md bg-fuchsia-400 p-4 col-span-full sm:col-span-1"
        >
          <div class="text-white text-lg font-medium">Buy our Merchandise!</div>
          <div class="text-white text-xs mt-2">
            Wear your support with pride.
          </div>
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
      <section class="sponsors py-16 flex flex-col items-center text-center">
        <h3 class="text-3xl font-bold text-gray-700 mb-10">Gold Sponsors</h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-screen-lg mx-auto"
        >
          <div
            v-for="(sponsor, index) in goldSponsors"
            :key="index"
            class="sponsor"
          >
            <a :href="sponsor.link" target="_blank">
              <img
                :src="sponsor.image"
                :alt="sponsor.name"
                class="h-28 object-contain mx-auto"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Silver Sponsors Section -->
      <section
        class="silver-sponsors py-16 flex flex-col items-center text-center bg-gray-50"
      >
        <h3 class="text-3xl font-bold text-gray-700 mb-10">Silver Sponsors</h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 max-w-screen-lg mx-auto"
        >
          <div
            v-for="(sponsor, index) in silverSponsors"
            :key="index"
            class="sponsor"
          >
            <a :href="sponsor.link" target="_blank">
              <img
                :src="sponsor.image"
                :alt="sponsor.name"
                class="h-20 object-contain mx-auto"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Bronze Sponsors Section -->
      <section
        class="bronze-sponsors py-16 flex flex-col items-center text-center"
      >
        <h3 class="text-3xl font-bold text-gray-700 mb-10">Bronze Sponsors</h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-screen-lg mx-auto"
        >
          <div
            v-for="(sponsor, index) in bronzeSponsors"
            :key="index"
            class="sponsor"
          >
            <a :href="sponsor.link" target="_blank">
              <img
                :src="sponsor.image"
                :alt="sponsor.name"
                class="h-20 object-contain mx-auto"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Community Partners Section -->
      <section
        class="community-partners py-16 flex flex-col items-center text-center bg-gray-50"
      >
        <h3 class="text-3xl font-bold text-gray-700 mb-10">
          Community Partners
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 max-w-screen-lg mx-auto"
        >
          <div
            v-for="(partner, index) in communityPartners"
            :key="index"
            class="partner"
          >
            <a :href="partner.link" target="_blank">
              <img
                :src="partner.image"
                :alt="partner.name"
                class="h-20 object-contain mx-auto"
              />
            </a>
          </div>
        </div>
      </section>
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
const imageRefs = [
  "https://scontent-dfw5-2.xx.fbcdn.net/v/t1.6435-9/61943043_2067162563407064_4747728038081331200_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=gUHsNDXZm_sQ7kNvwGGM6XY&_nc_oc=AdkjfpJ8yWGS4Gfyr9Z-P27RxUTyNhIyMfPtIrxbwvdPTS2za-eyK1gRNXt-moQTyLM&_nc_zt=23&_nc_ht=scontent-dfw5-2.xx&_nc_gid=WVUZKrhKWQ-qyMypuZ1qag&oh=00_AfKX3nZPdECjfwN3aibIjtIB3s4PfiC-plk_0F1K2eXU7Q&oe=68447766",
  "https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-6/464335962_8337242136399044_7762473312658236399_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=0b6b33&_nc_ohc=DuGFQdyj18cQ7kNvwEDHC8s&_nc_oc=AdkkffLm_olbOIY_9Q6VPZsDJjUoRHNYSnMMNmFhTCaF6tk-YiujsAXCPNKCFnjlTrY&_nc_zt=23&_nc_ht=scontent-dfw5-2.xx&_nc_gid=gkSyKd-XaupRryNm4co54A&oh=00_AfIp5lo9sT9IrfZ_QE0kcTc08US69zvrQeCZbVgN9bWOjA&oe=6822E2BB",
  "https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-6/464152053_8328599417263316_4529249896384968498_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=0b6b33&_nc_ohc=aKAHhU2EIkIQ7kNvwFb37Au&_nc_oc=AdnIicxKOqaxCUpQlg2OCsXg1TV2SBAotbkEdSeuVnEZ98L2URMthh32uavt9mYOGV8&_nc_zt=23&_nc_ht=scontent-dfw5-2.xx&_nc_gid=d4ZLmw9rI_dKx-ZbN0A7Zg&oh=00_AfKgE0Q2gm3n1wFEjwpbCLVs1DuFYnW56Yxl1qEC0Rmdmw&oe=6822E23F",
];

const goldSponsors = [
  {
    name: "Gold Sponsor 1",
    image: "/images/gold1.png",
    link: "https://example.com",
  },
  {
    name: "Gold Sponsor 2",
    image: "/images/gold2.png",
    link: "https://example.com",
  },
  // ...
];

const silverSponsors = [
  {
    name: "Silver Sponsor 1",
    image: "/images/silver1.png",
    link: "https://example.com",
  },
  {
    name: "Silver Sponsor 2",
    image: "/images/silver2.png",
    link: "https://example.com",
  },
  // ...
];

const bronzeSponsors = [
  {
    name: "Bronze Sponsor 1",
    image: "/images/bronze1.png",
    link: "https://example.com",
  },
  {
    name: "Bronze Sponsor 2",
    image: "/images/bronze2.png",
    link: "https://example.com",
  },
  // ...
];

const communityPartners = [
  {
    name: "Partner 1",
    image: "/images/partner1.png",
    link: "https://example.com",
  },
  {
    name: "Partner 2",
    image: "/images/partner2.png",
    link: "https://example.com",
  },
  // ...
];

onMounted(async () => {
  try {
    const data = await fetchCombinedEvents();

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
