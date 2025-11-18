<script setup lang="ts">
import { ref } from "vue";
import type { AbstractItem } from "~/types/prismaTypes";

const props = defineProps<{
  item: AbstractItem;
}>();

const router = useRouter();
const currentIndex = ref(0);

// Select image thumbnail
const selectImage = (index: number) => {
  currentIndex.value = index;
};

// Next / previous image (optional small arrows)
const nextImage = () => {
  if (!props.item.ItemPhotos?.length) return;
  currentIndex.value =
    (currentIndex.value + 1) % props.item.ItemPhotos.length;
};

const prevImage = () => {
  if (!props.item.ItemPhotos?.length) return;
  currentIndex.value =
    (currentIndex.value - 1 + props.item.ItemPhotos.length) %
    props.item.ItemPhotos.length;
};

// Navigate to detailed item page
const goToItemPage = () => {
  router.push(`/item/${props.item.id}`);
};
</script>

<template>
  <div
    class="flex flex-col items-center w-full max-w-[496px] mx-auto cursor-pointer"
  >
    <!-- ✅ MAIN IMAGE -->
    <div class="relative w-full" @click="goToItemPage">
      <img
        :src="props.item.ItemPhotos?.[currentIndex]?.url"
        :alt="props.item.name"
        class="w-full h-[350px] md:h-[400px] lg:h-[466px] object-cover rounded-xl shadow-md hover:scale-[1.01] transition-transform"
      />

      <!-- Navigation arrows -->
      <button
        @click.stop="prevImage"
        class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        @click.stop="nextImage"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
      >
        ›
      </button>
    </div>

    <!-- ✅ THUMBNAILS -->
    <div class="flex justify-center items-center w-full mt-4 gap-4">
      <img
        v-for="(photo, index) in props.item.ItemPhotos"
        :key="photo.id"
        :src="photo.url"
        @click.stop="selectImage(index)"
        class="w-[45px] h-[45px] md:w-[48px] md:h-[48px] lg:w-[50px] lg:h-[50px] rounded-md border cursor-pointer transition-transform object-cover"
        :class="{
          'border-blue-500 scale-105': index === currentIndex,
          'border-gray-300': index !== currentIndex
        }"
      />
    </div>

    <!-- ✅ PRICE & TITLE -->
    <div class="mt-6 text-center">
      <div v-if="props.item.price" class="flex justify-center items-center gap-3">
        <p class="text-gray-400 text-xl line-through">${{ props.item.price.toFixed(2) }}</p>
        <p class="text-red-500 text-xl italic">${{ props.item.price.toFixed(2) }}</p>
      </div>
      <p v-else class="text-black text-xl">${{ props.item.price.toFixed(2) }}</p>

      <p class="text-gray-800 text-lg mt-2">{{ props.item.name }}</p>
    </div>
  </div>
</template>

<style scoped>
img:hover {
  filter: brightness(1.05);
}
</style>
