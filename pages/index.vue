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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Placeholder when no date is selected -->
          <div v-if="!selectedDate" class="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-lg">
            <p class="text-gray-500">Select a date to view events</p>
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
</script>

<style scoped>
/* Custom styles for button hovers */
button.bg-lime-500:hover,
button.bg-red-500:hover {
  border-color: transparent;
}
</style>