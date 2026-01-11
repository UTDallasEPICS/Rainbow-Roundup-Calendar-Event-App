<template>
  <div>
    <!-- The tiny cart in the top right-->
    <button
      @click="goToCart"
      class="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition-transform"
      aria-label="Open cart"
    >
      <!-- cart SVG  Can I put this in other files?-->
      <svg class="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L6 6H3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="10" cy="19" r="1.4"></circle>
        <circle cx="18" cy="19" r="1.4"></circle>
      </svg>

      <!-- badge -->
      <span v-if="totalCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
        {{ totalCount }}
      </span>
    </button>
    <div v-if="item" class="max-w-[900px] mx-auto p-6 font-sans">
      <h1 class="text-2xl mb-4 font-bold">{{ item.name }}</h1>

      <div class="flex gap-6 items-start">
        <div>
          <img :src="selectedImage" alt="Item image" class="w-[300px] h-auto rounded-lg object-cover shadow-md">
          <!-- Thumbnail images -->
          <div v-if="item && item.ItemPhotos && item.ItemPhotos.length > 1" class="flex mt-4 space-x-2">
            <img
              v-for="photo in item.ItemPhotos"
              :key="photo.id"
              :src="photo.url"
              alt="Item thumbnail"
              class="w-16 h-16 rounded-md object-cover cursor-pointer border-2"
              :class="{'border-blue-500': selectedImage === photo.url}"
              @click="changeImage(photo.url)"
            >
          </div>
        </div>
        <div class="flex-1">
          <p class="text-lg mb-6 leading-snug">{{ itemDescription ||
              "No description available for this product."}}</p>

          <div class="space-y-4 font-semibold">
            <label class="block mb-4 font-semibold">
              Size:
              <select v-model="selectedSize" class="ml-2 px-2 py-1 text-base rounded border border-gray-300">
                <option disabled value="">Select size</option>
                <!-- only show sizes that are available (filtered in script) -->
                <option v-for="size in availableSizes" :key="size">{{ size }}</option>
              </select>
            </label>

            <label class="block mb-4 font-semibold">
              Quantity:
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                class="ml-2 px-2 py-1 text-base rounded border border-gray-300 w-16"
              />
            </label>
          </div>

          <p class="text-xl my-6">
            Total: <strong>${{ formattedPrice }}</strong>
          </p>
          <button
            :disabled="!canAddToCart"
            @click="addToCart"
            class="bg-blue-500 text-white px-4 py-2 text-lg rounded-md cursor-pointer transition-colors duration-300 enabled:hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <div v-else class="max-w-[600px] mx-auto mt-12 text-lg text-center">
      <p>Loading item details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AbstractItem, ItemVariant } from "~/types/prismaTypes";
import { useCartStore } from '~/stores/cart'; 

//pinia integration with cart
const cart = useCartStore();
const route = useRoute();
const router = useRouter();

const item = ref<AbstractItem | null>(null);
const itemDescription = ref(); // band aid fix, need to fix how data fetching is performed
const availableSizes = ref<string[]>([]);
const selectedImage = ref();
const selectedSize = ref<string>("");
const quantity = ref(1);

// computed with (sum of quantities)
const totalCount = computed(() =>
  (cart.items ?? []).reduce((s, i) => s + (i?.quantity ?? 0), 0)
);

// navigation to cart page
function goToCart() {
  router.push('/merchandise/cart');
}



function variantIsAvailable(v: any): boolean {
  if (!v) return false;
  if (typeof v.availability === 'boolean') return v.availability;
  if (typeof v.availbility === 'boolean') return v.availbility;
  return true;
}
onMounted(async () => { // TODO: Properly format this to use useFetch
  try {
    const res = await fetch(`/api/item/${route.params.id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const itemData = await res.json();
    if (!itemData.success) throw new Error(itemData.error || 'Failed to fetch item');

    item.value = itemData.data
    selectedImage.value = item.value?.ItemPhotos?.at(0)?.url
    itemDescription.value = item.value?.description

    availableSizes.value = (item.value?.ItemVariants ?? [])
      .filter((v: ItemVariant | any) => variantIsAvailable(v))
      .map((v: ItemVariant | any) => v.size)
      .filter(Boolean);

    selectedSize.value = "";
  } catch (error) {
    console.error('Failed to load item:', error);
    alert('Failed to load item.');
    router.push('/merchandise');
  }
});
function changeImage(url: string) {
  selectedImage.value = url;
}

const formattedPrice = computed(() => {
  if (!item.value) return '0.00';
  const basePrice = item.value.price;
  if (!Number.isFinite(basePrice) || quantity.value < 1) return '0.00';
  return (basePrice * quantity.value).toFixed(2);
});

const canAddToCart = computed(() => {
  return item.value !== null &&
    selectedSize.value !== "" &&
    quantity.value > 0 &&
    availableSizes.value.includes(selectedSize.value);
});

const addToCart = () => {
  if (!canAddToCart.value) {
    alert('Please select a valid size and quantity.');
    return;
  }

  const selectedVariant = item.value?.ItemVariants?.find(
    (v: ItemVariant | any) => v.size === selectedSize.value
  );

  if (!selectedVariant) {
    alert('Selected variant not found.');
    return;
  }

  if (!variantIsAvailable(selectedVariant)) {
    alert('That size is not available.');
    return;
  }

  const cartItem = {
    itemVariantId: (selectedVariant as any).id,
    productId: item.value!.id,
    name: item.value!.name,
    description:
      (selectedVariant as any).description ??
      item.value!.ItemVariants?.[0]?.description ??
      '',
    image: selectedImage.value,
    price: ((selectedVariant as any).price ?? item.value!.price ?? 0) as number,
    quantity: quantity.value
  };

  cart.addItem(cartItem);
  // small UX improvement: keep user on page but show mini confirm
  alert(`${cartItem.quantity} × "${cartItem.name}" (${selectedSize.value}) added to cart`);
};
</script>
