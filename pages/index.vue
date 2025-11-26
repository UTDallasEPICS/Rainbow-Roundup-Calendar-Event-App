<template>
  <div class="bg-blue-600 min-h-screen text-white flex flex-col">
    <!-- Centered Carousel -->
    <div class="w-full bg-white flex flex-col items-center">
      <div class="w-full max-w-screen-2xl pt-2">
        <div class="relative w-full overflow-hidden bg-white pb-10">
  <!-- Slides -->
  <div class="flex transition-transform duration-500 ease-in-out" ref="carousel">
    <!-- Slides 1 -->
    <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 flex items-center justify-center p-4">
      <img src="/images/icons/pwa_logo_512.png" 
      alt="Rainbow Roundup Logo" 
      class="max-h-52 md:max-h-96 object-contain w-auto">
    </div>
    <!-- Slides 2 -->
    <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 relative">
      <img src="/images/carousel_1.png" 
      alt="Sharing Header Graphic" 
      class="absolute inset-0 w-full h-full object-cover">
    </div>
    <!-- Slides 3 -->
    <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 relative">
      <img src="/images/carousel_2.png" 
      alt="Sharing Header Graphic" 
      class="absolute inset-0 w-full h-full object-cover">
    </div>
    <!-- Slides 4 -->
    <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 relative">
      <img src="/images/carousel_3.png" 
      alt="Sharing Header Graphic" 
      class="absolute inset-0 w-full h-full object-cover">
    </div>
  </div>

  <!-- Navigation Arrows - positioned absolutely over the carousel -->
  <button @click="prevSlide" 
    class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center z-10">
    &lt;
  </button>
  <button @click="nextSlide" 
    class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center z-10">
    &gt;
  </button>

  <!-- Carousel Dots -->
  <div class="absolute inset-x-0 bottom-3 flex justify-center space-x-2 z-10">
    <button
      v-for="i in totalSlides"
      :key="i"
      @click="goToSlide(i - 1)"
      class="w-3 h-3 rounded-full transition border border-transparent"
      :class="{
        'bg-blue-600': currentSlide === (i - 1),
        'bg-black/30': currentSlide !== (i - 1)
      }"
    ></button>
  </div>
</div>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="bg-white py-12 px-4 w-full">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">YOUR EVENT CALENDAR</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <!-- Calendar -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <button @click="prevMonth" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Prev</button>
              <div class="text-xl font-semibold text-gray-800">{{ currentMonthName }} {{ currentYear }}</div>
              <button @click="nextMonth" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Next</button>
            </div>

            <div class="grid grid-cols-7 gap-2 text-center text-gray-500 text-sm mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div class="grid grid-cols-7 gap-2">
              <div
                v-for="(date, index) in calendarDays"
                :key="index"
                class="p-3 border rounded cursor-pointer transition"
                :class="{
                  'bg-blue-50 text-blue-700 border-blue-300': isSelected(date),
                  'opacity-40': !isCurrentMonth(date),
                  'ring-2 ring-blue-500': isToday(date)
                }"
                @click="selectDate(date)"
              >
                <div class="text-right text-gray-700">{{ date.getDate() }}</div>
                <div class="mt-1 space-y-1">
                  <div
                    v-for="(event, i) in getEventsForDate(date)"
                    :key="i"
                    class="text-xs bg-blue-600 text-white rounded px-2 py-1 truncate"
                  >
                    {{ event.time }} — {{ event.title }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-center">
              <button @click="goToToday" class="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black rounded border border-black/10">Today</button>
            </div>
          </div>

          <!-- Selected Day Details -->
          <div class="bg-gray-50 rounded-lg p-6 border">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ selectedDate ? selectedDate.toDateString() : 'Select a date' }}
            </h3>

            
            <div v-if="selectedDate">
              <div v-if="getEventsForDate(selectedDate).length > 0" class="flex flex-wrap gap-4">
                <EventCard
                  v-for="(event, i) in getEventsForDate(selectedDate)"
                  :key="i"
                  :event="event"
                />
                  
              </div>
              <div v-else class="text-gray-500">No events for this day.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Cards Section -->
    <div class="bg-white grid grid-cols-1 gap-6 px-6 py-4">
      <!-- Support Families -->
      <div class="relative h-28 rounded-[20px] shadow-lg bg-lime-300 p-4">
        <div class="text-slate-900 text-lg font-medium">Support our Families!</div>
        <div class="text-slate-600 text-xs mt-2">Your kindness makes a difference.</div>
        <a
          href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
          target="_blank"
          rel="noopener noreferrer"
          class="absolute left-4 bottom-2 w-16 h-8 bg-lime-600 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center"
        >Donate</a>
      </div>

      <!-- Our Mission -->
      <div class="relative h-28 rounded-[20px] shadow-lg bg-blue-300 p-4">
        <div class="text-slate-900 text-lg font-medium">Our Mission</div>
        <div class="text-slate-600 text-xs mt-2">Learn how we're changing lives.</div>
        <NuxtLink to="/aboutUs">
          <button class="absolute left-4 bottom-2 w-16 h-8 bg-slate-500 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center">
            Read
          </button>
        </NuxtLink>
      </div>

      <!-- Merchandise -->
      <div class="relative h-28 rounded-[20px] shadow-lg bg-fuchsia-400 p-4 col-span-full sm:col-span-1">
        <div class="text-white text-lg font-medium">Buy our Merchandise!</div>
        <div class="text-white text-xs mt-2">Wear your support with pride.</div>
        <button class="absolute left-4 bottom-2 w-16 h-8 bg-fuchsia-800 text-white text-xs font-medium uppercase rounded-[5px] flex items-center justify-center">
          Buy
        </button>
      </div>
    </div>

    <!-- Facebook Button -->
    <div class="bg-white text-center py-20 w-full">
      <a
        href="https://www.facebook.com/rainbowroundup/"
        target="_blank"
        class="inline-block bg-blue-400 text-black border-2 border-black hover:bg-blue-500 hover:text-white px-6 py-3 rounded transition duration-200 text-lg"
      >Follow Us on Facebook for Latest News/Events</a>
    </div>

    <!-- Mission Section -->
    <div class="bg-zinc-200 text-center py-16 px-4 w-full">
      <h2 class="text-4xl text-stone-950 mb-4">Our Mission</h2>
      <p class="text-stone-950 max-w-3xl mx-auto text-lg">
        Rainbow Roundup is a non-profit organization that promotes acceptance in all aspects of lesbian, gay, bisexual and transgender families and allies, to serve and strengthen the community through social activities, education and connecting resources to individuals.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import EventCard from '~/components/EventCard.vue';
const events = ref([])
// Fetch events
try {
  const { data, error } = await useFetch('/api/event', { method: 'GET' });
  
  if (error.value) {
    console.error("Error fetching events: ", error.value);
  } else if (data.value) {
    // Transform Prisma events to match your template format
    events.value = data.value.map(event => {
      const eventDate = new Date(event.startTime);
      
      // Create a date in local timezone using the UTC values
      const localDate = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate(),
        eventDate.getUTCHours(),
        eventDate.getUTCMinutes(),
        eventDate.getUTCSeconds()
      );
      
      return {
        id: event.id,
        date: localDate,
        startTime: localDate,
        time: localDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        title: event.title,
        lat: event.eventLat?.toString() || "0",
        lng: event.eventLong?.toString() || "0"
      };
    });
    console.log('Fetched events:', events.value);
  }
} catch (err) {
  console.error("Error fetching events: ", err);
}

// State
const today = new Date();
today.setHours(0,0,0,0);

const currentSlide = ref(0);
const totalSlides = 4;
const interval = ref(null);

const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(today);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
//const events = useFetch('/api/event', { method: 'GET' })

// const events = ref([
//         {
//           date: new Date(2025, 6, 26), // July 26, 2025
//           time: '12:00 PM',
//           title: "Demo Event",
//           lat: "40.691116",
//           lng: "-74.091606"
//         },
        
//         {
//           date: new Date(2025, 6, 28), // July 28, 2025
//           time: '12:00 PM',
//           title: "NYC Party",
//           lat: "40.693428",
//           lng: "-74.097847"
//         },
//         {
//           date: new Date(2025, 6, 28), // July 28, 2025
//           time: '05:30 PM',
//           title: "Event NY",
//           lat: "40.694544",
//           lng: "-74.095453"
//         },
//         {
//           date: new Date(2025, 6, 29), // July 29, 2025
//           time: '10:00 AM',
//           title: "Sample Event",
//           lat: "40.694638",
//           lng: "-74.089211"
//         },
//         {
//           date: new Date(2025, 6, 29), // July 29, 2025
//           time: '2:15 PM',
//           title: "Park Meetup",
//           lat: "40.694130",
//           lng: "-74.079430"
//         },
//         {
//           date: new Date(2025, 6, 30), // July 30, 2025
//           time: '9:00 AM',
//           title: "Coffee & Code",
//           lat: "40.693122",
//           lng: "-74.071568"
//         },
//         {
//           date: new Date(2025, 6, 30), // July 30, 2025
//           time: '3:30 PM',
//           title: "Study Group",
//           lat: "40.692346",
//           lng: "-74.065899"
//         },
//         {
//           date: new Date(2025, 6, 31), // July 31, 2025
//           time: '12:00 PM',
//           title: "ReportPage",
//           lat: "40.689826",
//           lng: "-74.044504"
//         },
//         {
//           date: new Date(2025, 7, 7), // August 7, 2025
//           time: '4:00 PM',
//           title: "Coffee and Chili",
//           lat: "40.692319",
//           lng: "-74.069776"
//         }
//       ]);

// Template ref for the carousel track
const carousel = ref(null);

// Computed
const currentMonthName = computed(() => {
  return monthNames[currentMonth.value]});
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthDays = firstDay.getDay();
  const nextMonthDays = 6 - lastDay.getDay();
  const days = [];

  // Previous month trailing days
  for (let i = prevMonthDays; i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  // Next month leading days
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  // Ensure exactly 6 weeks (42 cells)
  while (days.length < 42) {
    const lastDate = days[days.length - 1];
    days.push(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1));
  }
  return days;
});

// Methods (as functions)
function startAutoSlide() {
  interval.value = setInterval(() => {nextSlide();}, 4000);
}

function stopAutoSlide() {
  if (interval.value) clearInterval(interval.value);
}

function nextSlide() {
  stopAutoSlide();
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
  updateCarousel();
  startAutoSlide();
}

function prevSlide() {
  stopAutoSlide();
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
  updateCarousel();
  startAutoSlide();
}

function goToSlide(index) {
  stopAutoSlide();
  currentSlide.value = index;
  updateCarousel();
  startAutoSlide();
}

function updateCarousel() {
  if (carousel.value) {
    carousel.value.style.transform = `translateX(-${currentSlide.value * 100}%)`;
  }
}

function isToday(date) {
  if (!date) return false;
  const now = new Date();
  now.setHours(0,0,0,0);
  return date.getTime() === now.getTime();
}

function isSelected(date) {
  if (!date || !selectedDate.value) return false;
  return date.getFullYear() === selectedDate.value.getFullYear() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getDate() === selectedDate.value.getDate();
}

function isCurrentMonth(date) {
  if (!date) return false;
  return date.getMonth() === currentMonth.value && date.getFullYear() === currentYear.value;
}

function selectDate(date) {
  selectedDate.value = date;
  if (date.getMonth() !== currentMonth.value || date.getFullYear() !== currentYear.value) {
    currentMonth.value = date.getMonth();
    currentYear.value = date.getFullYear();
  }
}

function getEventsForDate(date) {
  if (!date) return [];
  return events.value.filter(e => 
    e.date.getDate() === date.getDate() &&
    e.date.getMonth() === date.getMonth() &&
    e.date.getFullYear() === date.getFullYear()
    //console.log(date.value)
  );
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function goToToday() {
  const t = new Date();
  t.setHours(0,0,0,0);
  currentMonth.value = t.getMonth();
  currentYear.value = t.getFullYear();
  selectedDate.value = t;
}

// Lifecycle
onMounted(() => {
  startAutoSlide();
  updateCarousel();
});

onBeforeUnmount(() => {
  stopAutoSlide();
});

</script>