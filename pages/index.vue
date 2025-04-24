<template>
  <div class="min-h-screen  bg-gray-100 w-full flex flex-col items-center justify-center">
      <!-- Main content -->
      <div class="max-w-4xl p-6 space-y-6">

        <header class="mb-6">
          <h1 class="w-36 h-6 justify-center text-zinc-700 text-xl font-bold capitalize">Hello (name)!</h1>
        </header>
  
        <div class="w-36 h-6 justify-center text-zinc-700 text-xs font-extrabold uppercase">Your Calendar</div>

        <!-- Temporary card -->
        <div class="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 class="text-2xl font-semibold mb-2">Temporary Calendar Card</h2>
          <p class="text-gray-600 mb-4">This is a placeholder card for the calendar.</p>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Action</button>
        </div>

    <!-- Image Carousel Section
    <div class="flex flex-col items-center w-full">
      <div class="w-4/5 relative">
        <div class="overflow-hidden h-[20vh] md:h-[30vh]">
          <div class="flex transition-transform duration-300 h-full"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(image, index) in images" :key="index" class="min-w-full h-full flex-shrink-0">
              <img :src="image" class="w-full h-full object-cover" alt="carousel image" />
            </div>
          </div>
        </div>

        Dots
        <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          <div v-for="(_, index) in images" :key="index" class="w-2 h-2 rounded-full transition-colors duration-200"
            :class="currentIndex === index ? 'bg-white' : 'bg-white/50'"></div>
        </div>
      </div>
      <span class="text-sm md:text-base mt-2">Latest Event</span>
    </div> -->

    <!-- Events Cards -->
    <div class="flex items-center mt-[33px] space-x-4">
        <div class="w-36 h-6 justify-center text-zinc-700 text-xs font-extrabold uppercase">Upcoming Events</div>
            <!-- See All Events -->
            <NuxtLink to="/eventsPage" class="w-20 h-6 relative bg-white rounded-[50px] outline outline-1 outline-offset-[-1px] outline-zinc-600 overflow-hidden flex items-center justify-center no-underline">
                <span class="text-zinc-600 text-xs font-semibold capitalize">See All</span>
            </NuxtLink>
        </div>

        <!-- hard‑coded EventCard for visuals -->
        <div class="flex space-x-4 overflow-x-auto">
            <EventCard
            date-day="10"
            date-month="June"
            title="Event No 1"
            :going="20"
            :avatars="[
                'https://placehold.co/24x24',
                'https://placehold.co/24x24',
                'https://placehold.co/24x24'
            ]"
            location="Somewhere, Dallas"
            :saved="false"
            @update:saved="val => console.log('saved?', val)"
            @expand="onExpand"/>

            <EventCard
            date-day="10"
            date-month="June"
            title="pryde"
            :going="20"
            :avatars="[
                'https://placehold.co/24x24',
                'https://placehold.co/24x24',
                'https://placehold.co/24x24'
            ]"
            location="Somewhere, Dallas"
            :saved="false"
            @update:saved="val => console.log('saved?', val)"
            @expand="onExpand"/>
        </div>

        <!-- 2) Horizontally scrollable event cards -->
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


        <!-- Popup overlay for Make/Edit form -->
        <teleport to="body">
            <div
            v-if="showForm"
            @scroll="onScroll"
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
        <div class="w-36 h-6 justify-center text-zinc-700 text-xs font-extrabold uppercase">Image Gallery</div>
        <!-- Scrollable placards -->
        <div
            ref="gallery" @scroll="onScroll"
            class="w-80 overflow-x-auto flex space-x-4 snap-x snap-mandatory scrollbar-none pb-">
            <div v-for="n in 3" :key="n"
            class="flex-shrink-0 w-80 h-56 bg-amber-300 rounded-[20px] shadow-[0px_4px_0px_0px_rgba(80,85,136,0.25)] snap-start flex items-center justify-center">
                Placeholder {{ n }}
            </div>
        </div>

        <!-- Support our Families card -->
        <div class="block mt-6">
                <div class="w-80 h-28 relative rounded-[20px] shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] bg-lime-300">
                <!-- Title -->
                <div class="absolute left-[27px] top-[16px] text-slate-900 text-lg font-medium leading-loose">
                    Support our Families!
                </div>
                <!-- Description -->
                <div class="absolute left-[27px] top-[50px] text-slate-600 text-xs font-normal">
                    somethingsomething
                </div>
                <!-- Button -->
                <a href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
                    target="_blank" rel="noopener noreferrer"  @click.stop
                    class="absolute left-[26px] bottom-2.5 w-16 h-8 bg-lime-600 rounded-[5px] flex items-center justify-center"
                    >
                    <span class="text-white text-xs font-medium uppercase leading-snug">
                        Donate
                    </span>
                </a>   
                </div>
        </div>

        <!-- Our Mission card -->
        <div class="block mt-6">
                <div class="w-80 h-28 relative rounded-[20px] shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)] overflow-hidden bg-blue-300">
                <div class="absolute left-[27px] top-[16px] text-slate-900 text-lg font-medium leading-loose">
                    Our Mission
                </div>
                <div class="absolute left-[27px] top-[50px] text-slate-600 text-xs font-normal">
                    somethingsomething
                </div>
                <button class="absolute left-[26px] bottom-2.5 w-16 h-8 bg-slate-500 rounded-[5px] flex items-center justify-center">
                    <span class="text-white text-xs font-medium uppercase leading-snug">Read</span>
                </button>
                </div>
        </div>

        <!-- Buy our Merchandise card -->
        <div class="block mt-6">
                <div class="w-80 h-28 relative rounded-[20px] shadow-[0px_4px_4px_0px_rgba(80,85,136,0.20)] overflow-hidden bg-fuchsia-400">
                <div class="absolute left-[27px] top-[16px] text-white text-lg font-medium leading-loose">
                    Buy our Merchandise!
                </div>
                <div class="absolute left-[27px] top-[50px] text-white text-xs font-normal">
                    somethingsomething
                </div>
                <button class="absolute left-[26px] bottom-2.5 w-16 h-8 bg-fuchsia-800 rounded-[5px] flex items-center justify-center">
                    <span class="text-white text-xs font-medium uppercase leading-snug">Buy</span>
                </button>
                </div>
        </div>

        <!-- Sponsors Section-->
        <div class="flex items-center mt-[33px] space-x-4">
            <!-- Our Sponsors title https://rrup.org/contact-us/ -->
            <div class="w-36 h-6 flex items-center justify-center text-zinc-700 text-xl font-bold  capitalize">
                Our Sponsors
            </div>
            <!-- Become a Sponsor button -->
            <a href="https://rrup.org/contact-us/" target="_blank" rel="noopener noreferrer"  @click.stop
                class="w-36 h-6 relative bg-white rounded-[50px] outline outline-1 outline-offset-[-1px] outline-zinc-600 overflow-hidden flex items-center justify-center no-underline">
                <span class="text-zinc-600 text-xs font-semibold capitalize">
                Become a Sponsor</span>
            </a>
        </div>
  </div>
</div>
</template>


<script>
export default {
  name: "IndexPage",
  data() {
    return {
      images: [
        "/images/ProfileImage.png",
        "/images/backArrow.png",
        "/images/ProfileImage.png",
      ],
      currentIndex: 0,
      intervalId: null
    };
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeDestroy() {
    this.stopAutoPlay();
  },
  methods: {
    startAutoPlay() {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
  },
};
</script>
