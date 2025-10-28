<template>
  <div class="bg-blue-600 min-h-screen text-white flex flex-col">
    
    <!-- Centered Carousel -->
    <div class="w-full bg-white flex flex-col items-center">  
      <!-- Carousel Container - Full width but content centered -->
      <div class="w-full max-w-screen-2xl pt-2">
        <!-- Carousel Section -->
        <div class="relative w-full overflow-hidden bg-white">
          <!-- Slides Container -->
          <div class="flex transition-transform duration-500 ease-in-out" ref="carousel">
            <!-- Slide 1 -->
            <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 flex items-center justify-center p-4">
              <img src="/images/rrup_logo.png" 
                  alt="Rainbow Roundup Logo" 
                  class="max-h-52 md:max-h-80 object-contain">
            </div>
            <!-- Slide 2 - Full size image -->
            <div class="w-full flex-shrink-0 min-h-64 md:min-h-96 relative">
              <img src="/images/carousel_3.png" 
                  alt="Rainbow Roundup Event" 
                  class="absolute inset-0 w-full h-full object-cover">
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button @click="prevSlide" 
                  class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center">
            &lt;
          </button>
          <button @click="nextSlide" 
                  class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center">
            &gt;
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="bg-white py-12 px-4 w-full">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">YOUR EVENT CALENDAR</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Calendar -->
          <div class="bg-gray-100 p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center space-x-2">
                <button @click="prevMonth" class="text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <h3 class="text-xl font-semibold text-gray-800">{{ currentMonthName }} {{ currentYear }}</h3>
                <button @click="nextMonth" class="text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <button @click="goToToday" class="text-blue-600 hover:text-blue-800 text-sm">Today</button>
            </div>
            
            <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
<<<<<<< Updated upstream
            
            <div class="grid grid-cols-7 gap-1">
              <template v-for="(day, index) in calendarDays" :key="index">
                <div 
                  @click="selectDate(day)"
                  :class="{
                    'bg-blue-100 text-blue-800 font-bold': isSelected(day),
                    'text-gray-400': !isCurrentMonth(day),
                    'text-gray-800': isCurrentMonth(day),
                    'bg-blue-200': isToday(day)
                  }" 
                  class="p-2 text-center rounded-full cursor-pointer hover:bg-gray-200"
                >
                  {{ day.getDate() }}
                </div>
              </template>
            </div>
            
            <div class="mt-6">
              <h4 class="font-medium text-gray-800 mb-2">Events for {{ selectedDate ? formatDate(selectedDate) : 'selected day' }}</h4>
              <p v-if="!getEventsForDate(selectedDate).length" class="text-sm text-gray-600">No events scheduled</p>
              <ul v-else class="text-sm text-gray-600">
                <li v-for="event in getEventsForDate(selectedDate)" :key="event.title">
                  {{ event.title }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Upcoming Events - Only shown when a date is selected -->
          <div v-if="selectedDate" class="lg:col-span-2">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800">UPCOMING EVENTS - {{ formatDate(selectedDate) }}</h3>
              <NuxtLink to="/eventsPage" class="text-blue-600 hover:text-blue-800 text-sm font-medium">See All</NuxtLink>
            </div>
            
            <div class="space-y-4">
              <!-- Event Cards -->
              <div v-for="event in getEventsForDate(selectedDate)" :key="event.title" 
                   class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="bg-blue-100 text-blue-800 rounded-lg p-3 mr-4 text-center min-w-12">
                    <div class="font-bold text-lg">{{ selectedDate.getDate() }}</div>
                    <div class="text-xs">{{ monthNames[selectedDate.getMonth()].slice(0, 3) }}.</div>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ event.title }}</h4>
                    <p class="text-sm text-gray-600 mt-1">+0 Going</p>
                    <p class="text-xs text-gray-500 mt-1">Lat: {{ event.lat }}, Lng: {{ event.lng }}</p>
=======

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
>>>>>>> Stashed changes
                  </div>
                </div>
              </div>
            </div>
<<<<<<< Updated upstream
          </div>

          <!-- Placeholder when no date is selected -->
          <div v-if="!selectedDate" class="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-lg">
            <p class="text-gray-500">Select a date to view events</p>
=======

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
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </div>

    <!-- Support Cards Section -->
    <div class="bg-white grid grid-cols-1 gap-6 px-6 py-4">
        <!-- Support Families -->
        <div class="relative h-28 rounded-[20px] shadow-lg bg-lime-300 p-4">
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
        <div class="relative h-28 rounded-[20px] shadow-lg bg-blue-300 p-4">
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
          class="relative h-28 rounded-[20px] shadow-lg bg-fuchsia-400 p-4 col-span-full sm:col-span-1"
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

    <!-- Facebook Button -->
    <div class="bg-white text-center py-20 w-full">
      <a href="https://www.facebook.com/rainbowroundup/" 
         target="_blank" 
         class="inline-block bg-blue-400 text-black border-2 border-black hover:bg-blue-500 hover:text-white px-6 py-3 rounded transition duration-200 text-lg">
        Follow Us on Facebook for Latest News/Events
      </a>
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

<<<<<<< Updated upstream
<script>
export default {
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      currentSlide: 0,
      totalSlides: 2,
      interval: null,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      selectedDate: today,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      events: [
        {
          date: new Date(2025, 6, 26), // July 26, 2025
          time: '12:00 PM',
          title: "Demo Event",
          lat: "40.691116",
          lng: "-74.091606"
        },
        {
          date: new Date(2025, 6, 28), // July 28, 2025
          time: '12:00 PM',
          title: "ReportPage 2",
          lat: "38.114418",
          lng: "-84.556842"
        },
        {
          date: new Date(2025, 6, 31), // July 31, 2025
          time: '12:00 PM',
          title: "ReportPage",
          lat: "40.689826",
          lng: "-74.044504"
        },
        {
          date: new Date(2025, 7, 7), // August 7, 2025
          time: '4:00 PM',
          title: "Coffee and Chili",
          lat: "40.692319",
          lng: "-74.069776"
        }
      ]
    }
  },
  computed: {
    currentMonthName() {
      return this.monthNames[this.currentMonth];
    },
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth;
      
      // Get first day of month and last day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Get days from previous month to show
      const prevMonthDays = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Get days from next month to show
      const nextMonthDays = 6 - lastDay.getDay(); // Days needed to complete the last week
      
      // Calculate total days to show (always 6 weeks to keep calendar size consistent)
      const totalDays = prevMonthDays + lastDay.getDate() + nextMonthDays;
      
      const days = [];
      
      // Previous month days
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLastDay - i));
      }
      
      // Current month days
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
      }
      
      // Next month days
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
      
      // Ensure we always show 6 weeks (42 days) for consistent calendar height
      while (days.length < 42) {
        const lastDate = days[days.length - 1];
        days.push(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1));
      }
      
      return days;
    }
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
  methods: {
    startAutoSlide() {
      this.interval = setInterval(() => {
        this.nextSlide();
      }, 4000);
    },
    stopAutoSlide() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    nextSlide() {
      this.stopAutoSlide();
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.updateCarousel();
      this.startAutoSlide();
    },
    prevSlide() {
      this.stopAutoSlide();
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.updateCarousel();
      this.startAutoSlide();
    },
    updateCarousel() {
      const carousel = this.$refs.carousel;
      if (carousel) {
        carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
      }
    },
    selectDate(date) {
      this.selectedDate = date;
      // Update current month/year if selecting a date from different month
      if (date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear) {
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
      }
    },
    getEventsForDate(date) {
      if (!date) return [];
      
      return this.events.filter(event => {
        return event.date.getDate() === date.getDate() && 
               event.date.getMonth() === date.getMonth() && 
               event.date.getFullYear() === date.getFullYear();
      });
    },
    formatDate(date) {
      if (!date) return '';
      return `${this.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    isSelected(date) {
      return this.selectedDate && 
             date.getDate() === this.selectedDate.getDate() && 
             date.getMonth() === this.selectedDate.getMonth() && 
             date.getFullYear() === this.selectedDate.getFullYear();
    },
    isCurrentMonth(date) {
      return date.getMonth() === this.currentMonth && 
             date.getFullYear() === this.currentYear;
    },
    isToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date.getDate() === today.getDate() && 
             date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear();
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    goToToday() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
      this.selectedDate = today;
    }
  }
}
=======
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
const totalSlides = 2;
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
const currentMonthName = computed(() => monthNames[currentMonth.value]);

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
>>>>>>> Stashed changes
</script>

<style scoped>
/* Custom styles for button hovers */
button.bg-lime-500:hover,
button.bg-red-500:hover {
  border-color: transparent;
}
</style>