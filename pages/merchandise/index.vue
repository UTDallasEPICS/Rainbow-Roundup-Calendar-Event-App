<template>
      <div class="min-h-screen bg-global-1 flex flex-col justify-start items-center">
        <!-- Header Section -->
        <header class="w-full bg-header-1 px-4 sm:px-5 md:px-6 lg:px-[20px] py-4">
          <div class="w-full max-w-[1600px] mx-auto">
            <div class="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <img
                  src="/img_header_logo.png"
                  alt="Rainbow Roundup Logo"
                  class="w-[120px] h-[55px] sm:w-[140px] sm:h-[65px] md:w-[160px] md:h-[75px] lg:w-[174px] lg:h-[80px]"
                />
              </div>
              <div class="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-shrink-0">
                <NuxtLink to="/merchandise/cart" class="focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg transition-transform hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-14">
                    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </header>
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
                  style="background-image: url('/img_ellipse_1512.svg')"
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
                  style="background-image: url('/img_ellipse_1512.svg')"
                  aria-label="Next slide"
                >
                  <span class="text-slider-2 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-[37px]">
                    &gt;
                  </span>
                </button>

                <div class="text-center px-4 sm:px-6 md:px-8">
                  <h2 class="text-global-1 text-lg sm:text-xl md:text-2xl lg:text-[30px] font-medium leading-tight sm:leading-normal md:leading-relaxed lg:leading-[37px] mb-4 sm:mb-6 md:mb-8">
                    Support Us!
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
    
    
        <div class="w-full max-w-[1214px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
    <h2 class="text-3xl font-semibold my-8 text-center">Catalog</h2>
    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading items...
    </div>
  
    <div v-else-if="error" class="text-center py-10 text-red-600">
      {{ error }}

    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      <ItemPreview
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>

        <div class="w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]"></div>
      </div>
    </template>

    <script setup>
    

    const router = useRouter()
    // State
    const currentSlide = ref(0);
    const currentPage = ref(0);
    const searchQuery = ref("");
    const cart = ref([]);
    const items =ref([]); //database items
    const loading = ref(true);
    const error = ref(null);


    //Fetching items from the database
    onMounted(async () => {
      try {
        const { data, error: fetchError } = await $fetch("/api/item", {
          method: "GET"
        });

        if (fetchError) {
          throw new Error(fetchError.message || "Error fetching items");
        }

        items.value = data;
        // if (res && res.success && Array.isArray(res.data)) {
        //   items.value = res.data; // assign Prisma data
        // } else {
        //   console.log(data);
        //   console.warn("Invalid response format:", res);
        //   items.value = [];
        // }
      } catch (err) {
        error.value = err?.message || "Unknown error fetching items";
        console.error("Failed to fetch items:", err);
      } finally {
        loading.value = false;
      }
    });
 
    const heroSlides = ref([
      {
        id: 1,
        backgroundImage: "/img_banner.png",
        title: "Explore Our Collection",
        backgroundColor: "#d9d9d9"
      },
      {
        id: 2,
        backgroundImage: "/img_banner.png",
        title: "Discover Pride Apparel",
        backgroundColor: "#e0e0e0"
      },
      {
        id: 3,
        backgroundImage: "/img_banner.png",
        title: "Express Your True Self",
        backgroundColor: "#f0f0f0"
      }
    ])

    // Auto-play slider
    let autoPlayInterval = null;

    onMounted(() => {
      autoPlayInterval = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
      }, 6000);
    });

    onBeforeUnmount(() => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    });

    /*
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
    */
    // Methods (mostly not needed now)
    const handleShopByStyle = () => {
      console.log('Shop by Style clicked')
    }

    const addToCart = (itemVariantId) => {
      cart.value.push(itemVariantId);
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

    function goToCart() {
     router.push('/merchandise/cart')
    }

    const handlePageChange = (pageIndex) => {
      currentPage.value = pageIndex
    }

    // Clean up interval
    onBeforeUnmount(() => {
      clearInterval(autoPlayInterval)
    })
    </script>
