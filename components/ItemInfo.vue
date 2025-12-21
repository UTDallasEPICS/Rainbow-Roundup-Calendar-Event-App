<template>
  <div class="flex gap-10 p-6 border rounded-xl shadow-md w-full">

    <!-- LEFT SIDE — MAIN IMAGE + THUMBNAILS (NEW LAYOUT) -->
    <div class="flex flex-col items-center w-1/2">

      <!-- MAIN IMAGE -->
      <div class="relative w-full">
        <img
          :src="props.item.ItemPhotos?.[currentIndex]?.url"
          class="w-full h-96 object-contain rounded-lg"
        />

        <!-- LEFT ARROW -->
        <button
          @click="prevImage"
          class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          ‹
        </button>

        <!-- RIGHT ARROW -->
        <button
          @click="nextImage"
          class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          ›
        </button>
      </div>

      <!-- THUMBNAILS -->
      <div class="flex gap-3 mt-4">
        <img
          v-for="(photo, index) in props.item.ItemPhotos"
          :key="photo.id"
          :src="photo.url"
          @click="selectImage(index)"
          class="w-20 h-20 object-cover rounded-md border cursor-pointer transition"
          :class="{
            'border-blue-500 scale-105': index === currentIndex,
            'border-gray-300': index !== currentIndex,
          }"
        />
      </div>
    </div>

    <!-- RIGHT SIDE — TITLE, PRICE, SIZES, ADD TO CART -->
    <div class="flex flex-col justify-start w-1/2">

      <!-- TITLE & PRICE -->
      <h2 class="text-2xl font-semibold">{{ props.item.name }}</h2>
      <p class="text-xl text-gray-700 mt-1">${{ props.item.price }}</p>

      <!-- SIZES -->
      <div class="mt-4">
        <span class="font-medium">Sizes:</span>

        <div class="flex gap-3 mt-2">
          <button
            v-for="variant in props.item.ItemVariants"
            :key="variant.id"
            :class="[
              'px-3 py-1 rounded-md border transition',
              selectedVariantId === variant.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-400'
            ]"
            @click="selectedVariantId = variant.id"
          >
            {{ variant.size }}
          </button>
        </div>
      </div>

       <!-- Number selection -->
      <div class="mt-4">
        <label class="flex items-center gap-3">
          <span class="font-medium">Quantity</span>
          <input v-model.number="quantity" min="1" type="number" class="w-20 px-2 py-1 border rounded" />
        </label>
      </div>

      <!-- AVAILABILITY -->
      <p class="mt-4 text-sm text-gray-500">
        {{
          props.item.ItemVariants.some(v => variantIsAvailable(v))
            ? 'In stock'
            : 'Out of stock'
        }}
      </p>

      <!-- ADD TO CART -->
      <button
        class="mt-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        :disabled="!selectedVariantId"
        @click="handleAddToCart"
      >
        {{ selectedVariantId ? "Add to Cart" : "Select a Size" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { AbstractItem } from "~/types/prismaTypes";

const props = defineProps<{
  item: AbstractItem;
}>();

// Emit the variant ID when adding to cart (CHANGED)
const emit = defineEmits<{
  (e: "add-to-cart", variantId: string, qty: number): void;
}>(); 


// Image Gallery
const currentIndex = ref(0);
const selectedVariantId = ref<string | null>(null);
const selectImage = (index: number) => {
  currentIndex.value = index;
};


// Size Selection
const selectedSize = ref<string | null>(null);
const quantity = ref<number>(1);

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

// helper to determine availability 
function variantIsAvailable(v: any): boolean {
  if (typeof v.availability === 'boolean') return v.availability;
  return true;
}

// Add to cart logic
const handleAddToCart = () => {
  if (!selectedVariantId.value) return;
  const qty = quantity.value
  if (quantity.value < 1){
    const qty = 1;
  }
  emit("add-to-cart", selectedVariantId.value, qty);
};

// Router navigation when clicking the main image
const router = useRouter();
const goToItemPage = () => {
  router.push(`/merchandise/item/${props.item.id}`);
};

</script>

