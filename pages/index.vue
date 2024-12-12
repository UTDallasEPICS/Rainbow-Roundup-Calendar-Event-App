<template>
  <div class="py-4">
  <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="w-96 mx-auto rounded-md overflow-hidden" arrows>
    <img :src="item" class="w-full" draggable="false">
  </UCarousel>
  </div>

  <div class="flex flex-col items-center max-w-96 mx-auto text-center mt-4">
    <h1 class="text-xl font-bold mb-2">Our Mission</h1> <!-- Larger heading with margin-bottom -->
    <p class="text-sm leading-relaxed px-4">Rainbow Roundup is a non-profit organization that promotes acceptance in all aspects of lesbian, gay, bisexual and transgender families and allies, to serve and strengthen the community through social activities, education and connecting resources to individuals.</p>
  </div>


</template>

<script>
export default {
  data() {
    return {
      items: [
        'images/carousel_3.png',
        'images/carousel_2.png',
        'images/carousel_1.png'
      ],
    };
  },
};
</script>
