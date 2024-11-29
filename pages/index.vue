<template>
    <div class="w-full max-w-7xl mx-auto px-4 flex flex-col space-y-4">
      <!-- Navigation Buttons -->
      <!-- Navigation Buttons -->
    <div class="flex justify-between w-full mt-8">
      <NuxtLink 
        to="/sponsors"
        class="bg-[#3B82F6] text-black px-4 py-1.5 rounded-md min-w-[100px] text-center whitespace-nowrap"
      >
        Sponsor Us
      </NuxtLink>
      
      <NuxtLink
        to="/donate" 
        class="bg-[#84CC16] text-black px-4 py-1.5 rounded-md min-w-[100px] text-center whitespace-nowrap"
      >
        Donate Here
      </NuxtLink>
    </div>
  
      <!-- Image Carousel Section -->
  <!-- Image Carousel Section -->
  <div class="flex flex-col items-center w-full">
      <div class="w-4/5 relative">
        <div class="overflow-hidden h-[20vh] md:h-[30vh]">
          <div 
            class="flex transition-transform duration-300 h-full"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div 
              v-for="(image, index) in images" 
              :key="index"
              class="min-w-full h-full flex-shrink-0"
            >
              <img 
                :src="image"
                class="w-full h-full object-cover"
                alt="carousel image"
              />
            </div>
          </div>
        </div>
        
        <!-- Dots -->
        <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          <div
            v-for="(_, index) in images"
            :key="index"
            class="w-2 h-2 rounded-full transition-colors duration-200"
            :class="currentIndex === index ? 'bg-white' : 'bg-white/50'"
          ></div>
        </div>
      </div>
      <span class="text-sm md:text-base mt-2">Latest Event</span>
    </div>
  
      <!-- Latest Event Section -->
      <div class="flex flex-col items-center w-full">
        <div class="w-4/5 h-[20vh] md:h-[30vh] bg-green-500"></div>
        <span class="text-sm md:text-base mt-2">Upcoming Event</span>
      </div>
  
      <!-- Upcoming Event Section -->
      <div class="flex flex-col items-center w-full">
        <div class="w-4/5 h-[20vh] md:h-[30vh] bg-blue-500"></div>
      </div>
  
      <!-- Sign Up Section -->
      <div class="w-full flex justify-center">
        <NuxtLink
          to="/signup"
          class="bg-yellow-400 px-6 py-2 rounded-md text-sm md:text-base"
        >
          Sign Up Here
        </NuxtLink>
      </div>
  
      <!-- Contact Section -->
      <div class="w-4/5 mx-auto">
        <h3 class="text-sm md:text-base mb-2">Contact Us</h3>
        <div class="space-y-2 text-sm md:text-base">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded"></div>
            <span>xxx-xxx-xxxx</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded"></div>
            <span>xxxx@xxx.xxx</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded"></div>
            <span>xxx-xxx-xxxx</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'IndexPage',
  data() {
    return {
      images: [
        "/images/ProfileImage.png", 
        "/images/backArrow.png",
        "/images/ProfileImage.png"
      ],
      currentIndex: 0,
      intervalId: null
    }
  },
  mounted() {
    this.startAutoPlay()
  },
  beforeDestroy() {
    this.stopAutoPlay()
  },
  methods: {
    startAutoPlay() {
      this.intervalId = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    }
  }
}
</script>
