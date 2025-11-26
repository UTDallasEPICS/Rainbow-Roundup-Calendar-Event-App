<template>
  <div v-if="item" class="max-w-[900px] mx-auto p-6 font-sans">
    <h1 class="text-2xl mb-4 font-bold">{{ item.name }}</h1>

    <div class="flex gap-8 items-start">
      <!--Image needs to be fixed-->
      <img :src="item?.ItemPhotos?.[0]?.url || '/images/tshirt.png'" alt="Item image" class="w-[300px] h-auto rounded-lg object-cover shadow-md">
      <div class="flex-1">
        <p class="text-lg mb-6 leading-snug">{{ item.ItemVariants?.[0]?.description ||
            "No description available for this product."}}</p>

        <div class="space-y-4 font-semibold">
          <label class="block mb-4 font-semibold">
            Size:
            <select v-model="selectedSize" class="ml-2 px-2 py-1 text-base rounded border border-gray-300">
              <option disabled value="">Select size</option>
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
     
          <ItemInfo :item="item" 
          @add-to-cart="handleAddToCartFromItemInfo" />
      
      </div>
    </div>
  </div>

  <div v-else class="max-w-[600px] mx-auto mt-12 text-lg text-center">
    <p>Loading item details...</p>
  </div>
</template>

<script setup lang='ts'>
// protect page behind auth system

import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AbstractItem, ItemVariant } from "~/types/prismaTypes";
import { useCartStore } from '~/api/pinia/store' // adjust path if needed

// Pinia cart store
const cart = useCartStore()

const route = useRoute();
const router = useRouter();

const item = ref<AbstractItem | null>(null);
const availableSizes = ref<string[]>([]);
const selectedSize = ref<string>("");
const quantity = ref(1);
const imageUrl = ref('');

// load item on mount
onMounted(async () => {
  try {
    const res = await fetch(`/api/item/${route.params.id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch item');

    item.value = data.data;

    // Set available sizes
    availableSizes.value = item.value?.ItemVariants?.map(
      (v: ItemVariant) => v.size
    ) ?? [];
    // Set defaults to empty so user must select
    selectedSize.value = "";
  } catch (error) {
    console.error('Failed to load item:', error);
    alert('Failed to load item.');
    router.push('/merchandise');
  }
});

const formattedPrice = computed<string>(() => {
  if (!item.value) return '0.00';

  const basePrice = item.value.price;
    
  if (!Number.isFinite(basePrice) || quantity.value < 1) return '0.00';
  return (basePrice * quantity.value).toFixed(2);
});

const canAddToCart = computed<boolean>(() => {
  return (
    item.value !== null &&
    selectedSize.value !== "" &&
    quantity.value > 0
  );
});

/**
 * Called when user clicks the "Add to Cart" button on this page.
 * This pushes a CartItem into the Pinia store (no server POST required).
 */
const addToCart = () => {
  if (!canAddToCart.value) {
    alert('Please select size and quantity.');
    return;
  }

  // find the variant matching selectedSize
  const selectedVariant = item.value?.ItemVariants?.find(
    (v: ItemVariant) => v.size === selectedSize.value
  );

  if (!selectedVariant) {
    alert('Selected variant not found.');
    return;
  }

  // Build the cart item payload that matches the store's expected shape
  const cartItem = {
    variantId: (selectedVariant as any).id,
    productId: item.value!.id,
    name: item.value!.name,
    description:
      (selectedVariant as any).description ??
      item.value!.ItemVariants?.[0]?.description ??
      '',
    image: item.value!.ItemPhotos?.[0]?.url ?? '/images/tshirt.png',
    price: ((selectedVariant as any).price ?? item.value!.price ?? 0) as number,
    quantity: quantity.value
  };

  // add to pinia store - your store's addItem will merge if same variant exists
  cart.addItem(cartItem);

  alert(`${cartItem.quantity} × "${cartItem.name}" (${selectedSize.value}) added to cart`);

  // Optionally reset selection (uncomment if desired)
  // selectedSize.value = ''
  // quantity.value = 1
};


/**
 * Handler for itemInfo.vue emit.
 * If itemInfo emits `add-to-cart` with a variantId, this function will add that to the cart.
 * Wire it in template: <ItemInfo :item="item" @add-to-cart="handleAddToCartFromItemInfo" />
 */
const handleAddToCartFromItemInfo = (variantId: string) => {
  if (!item.value) return;

  const chosenVariant = item.value.ItemVariants?.find((v: any) => v.id === variantId);
  const price = (chosenVariant as any)?.price ?? item.value.price ?? 0;
  const description = (chosenVariant as any)?.description ?? item.value.ItemVariants?.[0]?.description ?? '';
  const image = item.value.ItemPhotos?.[0]?.url ?? '/images/tshirt.png';

  cart.addItem({
    variantId,
    productId: item.value.id,
    name: item.value.name,
    description,
    image,
    price,
    quantity: 1
  });

  alert('Added to cart');
};

</script>
