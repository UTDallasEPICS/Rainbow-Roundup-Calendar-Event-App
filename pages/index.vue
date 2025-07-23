<template>
  <div class="bg-blue-500 min-h-screen text-white flex flex-col">
    
    <!-- Centered Carousel Container -->
    <div class="flex-grow flex flex-col items-center justify-center px-6">
      <!-- Action Buttons - Centered above carousel -->
      <div class="flex justify-between w-full max-w-7xl mb-4">
        <button class="bg-lime-500 hover:bg-lime-600 text-black px-4 py-3 font-semibold border-2 border-white relative group/sponsor">
          Become a Sponsor!
          <span class="absolute right-0 opacity-0 group-hover/sponsor:opacity-100 transition-opacity duration-200 -mr-4">👍</span>
        </button>
        <button 
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-3 font-semibold border-2 border-white relative group/donate"
        href="https://buy.stripe.com/test_14k6op0Et2oF9xKaEE"
        target="_blank">
          Donate
          <span class="absolute right-0 opacity-0 group-hover/donate:opacity-100 transition-opacity duration-200 -mr-4">❤️</span>
        </button>
      </div>

      <!-- Carousel Section - No rounded corners -->
      <div class="relative w-full max-w-7xl overflow-hidden bg-white group">
        <!-- Slides Container -->
        <div class="flex transition-transform duration-500 ease-in-out" ref="carousel">
          <!-- Slide 1 -->
          <div class="w-full flex-shrink-0 min-h-64 flex items-center justify-center p-4">
            <img src="/Users/hamzamunis/Desktop/EPICS 2200/EPICSProject/Rainbow-Roundup-Calendar-Event-App-Summer25/public/images/ETC_Rainbow-Roundup_Logo.png" 
                 alt="Rainbow Roundup Logo" 
                 class="max-h-52 object-contain">
          </div>
          <!-- Slide 2 - Full size image -->
          <div class="w-full flex-shrink-0 min-h-64 relative">
            <img src="/Users/hamzamunis/Desktop/EPICS 2200/EPICSProject/Rainbow-Roundup-Calendar-Event-App-Summer25/public/images/carousel_3.png" 
                 alt="Rainbow Roundup Event" 
                 class="absolute inset-0 w-full h-full object-cover">
          </div>
        </div>
        
        <!-- Navigation Arrows -->
        <button @click="prevSlide" 
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
          &lt;
        </button>
        <button @click="nextSlide" 
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
          &gt;
        </button>
      </div>
    </div>

    <!-- Mission Section -->
    <div class="bg-gray-800 text-center py-16 px-4 w-full mt-auto">
      <h2 class="text-4xl mb-4">Our Mission</h2>
      <p class="text-gray-300 max-w-3xl mx-auto text-lg">
        Rainbow Roundup is a non-profit organization that promotes acceptance in all aspects of lesbian, gay, bisexual and transgender families and allies, to serve and strengthen the community through social activities, education and connecting resources to individuals.
      </p>
    </div>

    <!-- Facebook Button -->
    <div class="bg-black text-center py-20 w-full">
      <a href="https://www.facebook.com/rainbowroundup/" 
         target="_blank" 
         class="inline-block text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-white px-6 py-3 rounded transition duration-200 text-lg">
        Follow Us on Facebook for Latest News/Events
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      totalSlides: 2,
      interval: null
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