<template>
  <div class="min-h-screen bg-global-1 flex flex-col justify-start items-center">
    <!-- Header Section -->
    <header class="w-full bg-header-1 px-4 sm:px-5 md:px-6 lg:px-[20px] py-4">
      <div class="w-full max-w-[1600px] mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <img
              src="/public/img_header_logo.png"
              alt="Rainbow Roundup Logo"
              class="w-[120px] h-[55px] sm:w-[140px] sm:h-[65px] md:w-[160px] md:h-[75px] lg:w-[174px] lg:h-[80px]"
            />
          </div>

          <!-- Search Bar -->
          <div class="w-full lg:w-[64%] max-w-2xl">
            <form @submit.prevent="handleSearch" class="relative w-full">
              <div class="relative flex items-center">
                <div class="absolute left-3 sm:left-4 z-10 flex items-center justify-center">
                  <img
                    src="/public/img_search.svg"
                    alt="Search"
                    class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                  />
                </div>
               
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search"
                  class="w-full bg-searchview-1 text-searchview-1 placeholder-searchview-1 border border-solid border-black rounded-[22px] sm:rounded-[32px] md:rounded-[44px] px-3 sm:px-4 md:px-6 lg:px-[98px] py-2 sm:py-2.5 md:py-3 lg:py-[12px] text-sm sm:text-base md:text-lg lg:text-[40px] font-medium leading-tight sm:leading-normal md:leading-relaxed lg:leading-[49px] text-center focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 pl-10 sm:pl-12 md:pl-14 lg:pl-[98px] hover:bg-gray-50"
                />
              </div>
            </form>
          </div>

          <!-- Cart and Login -->
          <div class="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-shrink-0">
            <button class="focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg transition-transform hover:scale-105 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sm:size-6 md:size-10 lg:size-14">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Menu -->
    <div class="w-full mt-[34px]">
      <div class="w-full max-w-[1600px] mx-auto">
        <div class="flex flex-col sm:flex-row w-full">
          <button
            @click="handleShopByStyle"
            class="w-full border-t border-solid border-black px-4 sm:px-6 md:px-8 lg:px-[34px] py-4 sm:py-5 md:py-6 lg:py-[22px] text-sm sm:text-base md:text-lg lg:text-[28px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[33px] text-center text-button-1 bg-button-1 rounded-none hover:bg-gray-50 focus:ring-gray-300"
          >
            Shop by Style
          </button>
          <button
            @click="handleShopByFit"
            class="w-full border-t border-solid border-black px-4 sm:px-6 md:px-8 lg:px-[34px] py-4 sm:py-5 md:py-6 lg:py-[22px] text-sm sm:text-base md:text-lg lg:text-[28px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[33px] text-center text-button-1 bg-button-1 rounded-none hover:bg-gray-50 focus:ring-gray-300"
          >
            Shop by Fit
          </button>
          <button
            @click="handleDonate"
            class="w-full border-t border-solid border-black px-4 sm:px-6 md:px-8 lg:px-[34px] py-3 sm:py-4 md:py-5 lg:py-[20px] text-sm sm:text-base md:text-lg lg:text-[28px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[33px] text-center text-button-1 bg-button-1 rounded-none hover:bg-gray-50 focus:ring-gray-300"
          >
            Donate
          </button>
          <button
            @click="handleMainPage"
            class="w-full border-t border-solid border-black px-4 sm:px-6 md:px-8 lg:px-[34px] py-3 sm:py-4 md:py-5 lg:py-[20px] text-sm sm:text-base md:text-lg lg:text-[28px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[33px] text-center text-button-1 bg-button-1 rounded-none hover:bg-gray-50 focus:ring-gray-300"
          >
            Main Page
          </button>
        </div>
      </div>
    </div>

    <!-- Hero Slider -->
    <div class="w-full mt-[82px]">
      <div class="w-full max-w-[1600px] mx-auto">
        <div class="relative w-full overflow-hidden">
          <div class="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[474px]">
            <div
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              class="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
              :class="{'opacity-100 z-10': currentSlide === index, 'opacity-0 z-0': currentSlide !== index}"
            >
              <div
                class="absolute inset-0 w-full h-full bg-slider-1"
                :style="{ backgroundColor: slide.backgroundColor }"
              />
             
              <div
                v-if="slide.backgroundImage"
                class="absolute inset-0 w-full h-full bg-cover bg-center"
                :style="{ backgroundImage: `url(${slide.backgroundImage})` }"
              />

              <div class="absolute inset-0 flex flex-col justify-center items-center z-20">
                <button
                  v-if="heroSlides.length > 1"
                  @click="prevSlide"
                  class="absolute left-4 sm:left-6 md:left-8 lg:left-0 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[84px] lg:h-[88px] bg-cover bg-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-transform hover:scale-105 active:scale-95 z-30"
                  style="background-image: url('/public/img_ellipse_1512.svg')"
                  aria-label="Previous slide"
                  >
                  <span class="text-slider-2 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-[37px]">
                    &lt;
                  </span>
                </button>

                <button
                  v-if="heroSlides.length > 1"
                  @click="nextSlide"
                  class="absolute right-4 sm:right-6 md:right-8 lg:right-0 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[84px] lg:h-[88px] bg-cover bg-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-transform hover:scale-105 active:scale-95 z-30"
                  style="background-image: url('/public/img_ellipse_1512.svg')"
                  aria-label="Next slide"
                >
                  <span class="text-slider-2 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-[37px]">
                    &gt;
                  </span>
                </button>

                <div class="text-center px-4 sm:px-6 md:px-8">
                  <h2 class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px] mb-4 sm:mb-6 md:mb-8">
                    Hero Banner
                  </h2>
                </div>

                <div class="bg-global-1 px-4 sm:px-8 md:px-12 lg:px-[60px] py-3 sm:py-4 md:py-5 lg:py-[12px] rounded-lg sm:rounded-xl shadow-[0px_4px_4px_#0000003f] mx-4 sm:mx-6 md:mx-8">
                  <h1 class="text-global-1 text-2xl sm:text-3xl md:text-4xl lg:text-[60px] font-extralight leading-tight sm:leading-normal md:leading-relaxed lg:leading-[73px] text-center">
                    {{ slide.title || "Explore Our Collection" }}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div v-if="heroSlides.length > 1" class="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-[16px] left-1/2 transform -translate-x-1/2 z-30">
            <div class="flex items-center justify-center gap-2 sm:gap-3">
              <button
                v-for="(_, index) in heroSlides"
                :key="index"
                @click="goToSlide(index)"
                class="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                :class="{'bg-pagerindicator-1 scale-110 shadow-sm': currentSlide === index, 'bg-gray-400 hover:bg-gray-300 active:scale-95': currentSlide !== index}"
                :aria-label="`Go to slide ${index + 1}`"
                :aria-current="currentSlide === index ? 'page' : undefined"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

<!-- Pagination Indicator -->
<div class="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-[16px] mb-4 sm:mb-6 md:mb-8 lg:mb-[16px]">
  <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
    <div class="flex justify-center">
      <div class="w-full sm:w-3/4 md:w-1/2 lg:w-[8%]">
        <div class="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
          <button
            v-for="(_, index) in 5"
            :key="index"
            @click="handlePageChange(index)"
            class="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            :class="{
              'bg-pagerindicator-1 scale-110 shadow-sm': currentPage === index, 
              'bg-gray-300 hover:bg-gray-400 active:scale-95': currentPage !== index
            }"
            :aria-label="`Go to page ${index + 1}`"
            :aria-current="currentPage === index ? 'page' : undefined"
          />
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- Product Section -->
     <ItemPreview
     v-for="item in items"
     :key="item.id"
     :item="item"
     @add-to-cart="addToCart"
     ></ItemPreview>



    <div class="w-full">
      <div class="w-full max-w-[1214px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-0 justify-start items-center">
          <!-- First Product -->
          <div class="w-full lg:w-1/2 flex flex-col justify-start items-center">
            <div class="w-full max-w-[496px] flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-[12px] justify-start items-center">
              <img
                src="/public/img_firstshirt.png"
                alt="Adult's Shirt"
                class="w-full max-w-[496px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[466px] object-cover"
              />
              <div class="flex justify-between items-center w-full px-4 sm:px-5 md:px-6 lg:px-[18px]">
                <img
                  src="/public/img_left.svg"
                  alt="Previous color"
                  class="w-3 h-6 sm:w-4 sm:h-7 md:w-5 md:h-8 lg:w-[12px] lg:h-[24px] cursor-pointer hover:scale-110 transition-transform"
                />
                <div class="flex gap-4 sm:gap-5 md:gap-6 lg:gap-[24px] justify-center items-center">
                  <img
                    src="/public/img_1.1.png"
                    alt="Color option"
                    class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                  />
                  <img
                    src="/public/img_1.2.png"
                    alt="Color option"
                    class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                  />
                  <img
                    src="/public/img_1.3.png"
                    alt="Color option"
                    class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                  />
                  <img
                    src="/public/img_1.4.png"
                    alt="Color option"
                    class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                  />
                  <img
                    src="/public/img_1.5.png"
                    alt="Color option"
                    class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
                <img
                  src="/public/img_right.svg"
                  alt="Next color"
                  class="w-3 h-6 sm:w-4 sm:h-7 md:w-5 md:h-8 lg:w-[12px] lg:h-[24px] cursor-pointer hover:scale-110 transition-transform"
                />
              </div>
            </div>
            <div class="mt-8 sm:mt-10 md:mt-12 lg:mt-[46px] text-center">
              <p class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-light leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px] mb-4 sm:mb-5 md:mb-6 lg:mb-[22px]">
                $25.00
              </p>
              <p class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-light leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px]">
                Adult's Shirt
              </p>
            </div>
          </div>

          <!-- Second Product -->
          <div class="w-full lg:w-1/2 flex flex-col justify-start items-center">
            <div class="w-full max-w-[496px] flex flex-col justify-start items-end">
              <div class="w-full max-w-[406px] flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-[12px] justify-start items-center">
                <img
                  :src="currentChildrenShirtImage"
                  alt="Children's Shirt"
                  class="w-full max-w-[496px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[466px] object-cover transition-opacity duration-300"
                  :class="{ 'opacity-0': isImageChanging }"
                />
                <div class="flex justify-center items-center w-full px-4 sm:px-5 md:px-6 lg:px-[18px]">
                  <img
                    src="/public/img_left.svg"
                    alt="Previous color"
                    class="w-3 h-6 sm:w-4 sm:h-7 md:w-5 md:h-8 lg:w-[12px] lg:h-[24px] mr-3 sm:mr-4 cursor-pointer hover:scale-110 transition-transform"
                    @click="prevChildrenShirtImage"
                  />
                  <div class="flex gap-4 sm:gap-5 md:gap-6 lg:gap-[24px] justify-center items-center px-8 sm:px-10 md:px-12 lg:px-[42px]">
                    <img
                      v-for="(image, index) in childrenShirtImages"
                      :key="index"
                      :src="image.thumbnail"
                      alt="Color option"
                      class="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] cursor-pointer hover:scale-105 transition-transform"
                      :class="{ 'ring-2 ring-blue-500': currentChildrenShirtIndex === index }"
                      @click="selectChildrenShirtImage(index)"
                    />
                  </div>
                  <img
                    src="/public/img_right.svg"
                    alt="Next color"
                    class="w-3 h-6 sm:w-4 sm:h-7 md:w-5 md:h-8 lg:w-[12px] lg:h-[24px] ml-3 sm:ml-4 cursor-pointer hover:scale-110 transition-transform"
                    @click="nextChildrenShirtImage"
                  />
                </div>
              </div>
              <div class="mt-8 sm:mt-10 md:mt-12 lg:mt-[46px] text-center pl-4 sm:pl-6 md:pl-8">
                <div class="flex items-center justify-center gap-3 sm:gap-4 lg:gap-[14px]">
                  <p class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px] line-through">
                    $25.00
                  </p>
                  <p class="text-slider-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-normal italic leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px]">
                    $15.00
                  </p>
                </div>
              </div>
              <div class="mt-4 sm:mt-5 md:mt-6 lg:mt-[22px] text-center relative right-1 sm:right-2">
                <p class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-light leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px]">
                  Children's Shirt!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Footer Spacing -->
    <div class="w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]"></div>
  </div>
</template>

<script setup>

import ItemPreview from "/components/ItemPreview.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue'
/*
const items = ref([
  {
    id: "test123",
    name: "Cool Shirt",
    price: 20.99,

    ItemPhotos: [
      { id: "1", url: "/img_firstshirt.png", itemId: "test123" },
      { id: "2", url: "/img_1.1.png", itemId: "test123" },
      { id: "3", url: "/img_1.2.png", itemId: "test123" }
    ],

    ItemVariants: [
      {
        id: "v1",
        size: "XXS",
        description: "Small but mighty",
        availbility: true,
        itemId: "test123",
      },
      {
        id: "v2",
        size: "XL",
        description: "Large and proud",
        availbility: false,
        itemId: "test123",
      },
      {
        id: "v3",
        size: "XXL",
        description: "Big confidence energy",
        availbility: true,
        itemId: "test123",
      },
    ],
  }
])
*/

// State
const currentSlide = ref(0)
const currentPage = ref(0)
const searchQuery = ref('')
const cart = ref([])

// Children's shirt image gallery
const childrenShirtImages = ref([
  {
    main: '/public/img_secondshirt.png',
    thumbnail: '/public/img_1.1.png'
  },
  {
    main: '/public/img_secondshirt_blue.png',
    thumbnail: '/public/img_1.2.png'
  },
  {
    main: '/public/img_secondshirt_red.png',
    thumbnail: '/public/img_1.3.png'
  },
  {
    main: '/public/img_secondshirt_green.png',
    thumbnail: '/public/img_1.4.png'
  },
  {
    main: '/public/img_secondshirt_yellow.png',
    thumbnail: '/public/img_1.5.png'
  }
])

const currentChildrenShirtIndex = ref(0)
const currentChildrenShirtImage = ref(childrenShirtImages.value[0].main)
const isImageChanging = ref(false)

// Hero slider data
const heroSlides = ref([
  {
    id: 1,
    backgroundImage: "/public/img_banner.png",
    title: "Explore Our Collection",
    backgroundColor: "#d9d9d9"
  },
  {
    id: 2,
    backgroundImage: "/public/img_banner.png",
    title: "Discover Pride Apparel",
    backgroundColor: "#e0e0e0"
  },
  {
    id: 3,
    backgroundImage: "/public/img_banner.png",
    title: "Express Your True Self",
    backgroundColor: "#f0f0f0"
  }
])

// Auto-play slider
let autoPlayInterval
onMounted(() => {
  autoPlayInterval = setInterval(nextSlide, 6000)
})

// Methods for children's shirt image gallery
const selectChildrenShirtImage = (index) => {
  if (index === currentChildrenShirtIndex.value) return
  
  isImageChanging.value = true
  setTimeout(() => {
    currentChildrenShirtIndex.value = index
    currentChildrenShirtImage.value = childrenShirtImages.value[index].main
    isImageChanging.value = false
  }, 150)
}

const nextChildrenShirtImage = () => {
  isImageChanging.value = true
  setTimeout(() => {
    currentChildrenShirtIndex.value = (currentChildrenShirtIndex.value + 1) % childrenShirtImages.value.length
    currentChildrenShirtImage.value = childrenShirtImages.value[currentChildrenShirtIndex.value].main
    isImageChanging.value = false
  }, 150)
}

const prevChildrenShirtImage = () => {
  isImageChanging.value = true
  setTimeout(() => {
    currentChildrenShirtIndex.value = (currentChildrenShirtIndex.value - 1 + childrenShirtImages.value.length) % childrenShirtImages.value.length
    currentChildrenShirtImage.value = childrenShirtImages.value[currentChildrenShirtIndex.value].main
    isImageChanging.value = false
  }, 150)
}

// Methods
const handleShopByStyle = () => {
  console.log('Shop by Style clicked')
}




const addToCart = (variantId) => {
  cart.value.push(variantId);
};


const handleShopByFit = () => {
  console.log('Shop by Fit clicked')
}

const handleDonate = () => {
  console.log('Donate clicked')
}

const handleMainPage = () => {
  console.log('Main Page clicked')
}

const handleSearch = () => {
  console.log('Search:', searchQuery.value)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const handlePageChange = (pageIndex) => {
  currentPage.value = pageIndex
}

// Clean up interval
onBeforeUnmount(() => {
  clearInterval(autoPlayInterval)
})
</script>

