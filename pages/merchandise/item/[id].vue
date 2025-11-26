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

        <!--
          Example of using itemInfo component (if you want to render it here)
          and listen to its emit. Uncomment and adjust if you render the component
          inside this page.

          <ItemInfo :item="item" @add-to-cart="handleAddToCartFromItemInfo" />
        -->
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
//import { useCartStore } from '~/api/pinia/store' // adjust path, doesn't work currently

// Pinia integration
//const cart = useCartStore()

const route = useRoute();
const router = useRouter();

const item = ref<AbstractItem | null>(null);

// availableSizes now only includes variants that are marked available in DB
const availableSizes = ref<string[]>([]);
const selectedSize = ref<string>("");
const quantity = ref(1);
const imageUrl = ref('');

// helpers to check the availability in the db
function variantIsAvailable(v: any): boolean {
  // Check if it is availble based on the availability
  if (typeof v.availability === 'boolean') return v.availability; //which one did I put in lol
  if (typeof v.availbility === 'boolean') return v.availbility;
  return false;
}

// load item on mount
onMounted(async () => {
  try {
    const res = await fetch(`/api/item/${route.params.id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch item');

    item.value = data.data;

    // Set available sizes to only those variants that are available
    availableSizes.value = (item.value?.ItemVariants ?? [])
      .filter((v: ItemVariant | any) => variantIsAvailable(v))
      .map((v: ItemVariant | any) => v.size)
      .filter(Boolean);

    // Set defaults to empty so user must select
    selectedSize.value = "";
  } catch (error) {
    console.error('Failed to load item:', error);
    alert('Failed to load item.');
    router.push('/merchandise');
  }
});
//formats price
const formattedPrice = computed<string>(() => {
  if (!item.value) return '0.00';

  const basePrice = item.value.price;
    
  if (!Number.isFinite(basePrice) || quantity.value < 1) return '0.00';
  return (basePrice * quantity.value).toFixed(2);
});

const canAddToCart = computed<boolean>(() => {
  // Sees if the selected size is availble, has a value, and is in the db
  return (
    item.value !== null &&
    selectedSize.value !== "" &&
    quantity.value > 0 &&
    availableSizes.value.includes(selectedSize.value)
  );
});

/*
User triggers this with clicking addtocart
 We will push what is in the cart into the Pinia store.
 */
const addToCart = () => {
  if (!canAddToCart.value) {
    alert('Please select a valid size and quantity.');
    return;
  }

  // find the variant matching selectedSize
  const selectedVariant = item.value?.ItemVariants?.find(
    (v: ItemVariant | any) => v.size === selectedSize.value
  );

  if (!selectedVariant) { //Basic error handling
    alert('Selected variant not found.');
    return;
  }

  // Prevents adding random or removed variants
  if (!variantIsAvailable(selectedVariant)) {
    alert('That size is not available.');
    return;
  }

  // Builds the item in the cart based on pinia store
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

  // Calls additem in the pinia store to use the function
  //cart.addItem(cartItem);

  alert(`${cartItem.quantity} × "${cartItem.name}" (${selectedSize.value}) added to cart`); //tells the user it happens

};


/*
 * Handler for itemInfo.vue emit.
 * If itemInfo emits `add-to-cart` with (variantId, quantity), this function will add that to the cart.
 * Wire it in template: <ItemInfo :item="item" @add-to-cart="handleAddToCartFromItemInfo" />
 *
 * We accept a second optional `qty` argument (the itemInfo component can emit quantity).
 * If qty is not provided, we fall back to the page-level `quantity` input.
 */
const handleAddToCartFromItemInfo = (variantId: string, qty?: number) => {
  if (!item.value) return;

  const chosenVariant = item.value.ItemVariants?.find((v: any) => v.id === variantId);
  if (!chosenVariant) {
    alert('Variant not found.');
    return;
  }

  // ensure the variant is available
  if (!variantIsAvailable(chosenVariant)) {
    alert('That size is not available.');
    return;
  }

  // use passed qty if provided, otherwise default to the page quantity
  const qtyToAdd = (typeof qty === 'number' && qty > 0) ? Math.floor(qty) : Math.max(1, Math.floor(quantity.value));

  const price = (chosenVariant as any)?.price ?? item.value.price ?? 0;
  const description = (chosenVariant as any)?.description ?? item.value.ItemVariants?.[0]?.description ?? '';
  const image = item.value.ItemPhotos?.[0]?.url ?? '/images/tshirt.png';

  /*cart.addItem({
    variantId,
    productId: item.value.id,
    name: item.value.name,
    description,
    image,
    price,
    quantity: qtyToAdd
  });
  */
  alert(`Added ${qtyToAdd} × "${item.value.name}" to cart`);
};

</script>
