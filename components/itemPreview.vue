<script setup lang="ts">
import { Size } from '@prisma/client'
import type { FinishedItem } from '@prisma/client'

const item = {
    id: "89723786312678312iu",
    name: "cool shirt",
    FinishedItems: [
        {
            id: "298173",
            quantity: 5,
            size: Size.XXS,
            price: 20.99, 
            itemId: "coolestShirt",
            

        }, {}, {},
    ]
}

/* 
Need to have scrolling functionality
Should exist as a component
Must be clickable and link to that items info page
*/


// 
// use useFetch() to grab the information from the server directory (the server directory is your backend. it can call the database functions to grab the data)
// useFetch(`/api/item/${primary key}`, method GET) <- kind of what this would look like, not exactly the right syntax
// 
// use @click for the component to make the component navigate you to the item info page
// scrolling functionality (chatpgpt this)


/* defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: Array, default: () => [] },   // e.g. ["img1.jpg", "img2.jpg"]
  sizes: { type: Array, default: () => [] },    // e.g. ["S", "M", "L", "XL"]
  inventory: { type: Number, default: 0 }
}) */

//const props = defineProps({item: FinishedItem}) //It is finalizeditem rn, will be itemvariant 
//Pull in one thing

const router = useRouter() 

//const {data, pending, error }  = await useFetch("/api/item/:id"); //Where to store this?

const emit = defineEmits(["add-to-cart"])

const handleAddToCart = () => 
    emit("add-to-cart") //Add to index.vue @add-to-cart="updateCart",
    // Define the addToCartMethod{
    //    this.$emit('add-to-cart', this.variants[this.selectedVariant].id)   
    // } 
    
/* Add to index.vue
updateCart(){
  this.cart += 1;
} 
  or
updateCart(id){
  this.cart.push(id)
}

*/
</script>

<template>
  <div class="product-card border rounded-xl shadow-md p-4"> // "w-full lg:w-1/2 flex flex-col justify-start items-center"
    <!-- Product images -->
    <div class="relative"> <!-- changable name -->
      <img :src="ItemPhoto.url" :alt="ItemVariant.description" class="w-full h-64 object-cover rounded-lg" />
    </div>
      <!-- images are located in the public page rn -->
    <!-- Product info -->
    <h2 class="text-xl font-semibold mt-3">{{ name }}</h2>
    <p class="text-lg text-gray-700">${{ price.toFixed(2) }}</p>

    <!-- Sizes -->
    <div v-if="sizes.length" class="mt-2">
      <span class="font-medium">Sizes:</span>
      <div class="flex gap-2 mt-1">
        <span v-for="size in sizes" :key="size" class="border px-2 py-1 rounded-md">
          {{ size }}
        </span>
      </div>
    </div>

    <!-- Inventory -->
    <p class="mt-2 text-sm text-gray-500">
      {{ availability === true ? `in stock` : "Out of stock" }}
    </p>

    <!-- Add to Cart Button -->
    <button
      @click="handleAddToCart"
      :disabled="availability === false" 
      class="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-400"
    >
      {{ availability > 0 ? "Add to Cart" : "Sold Out" }} //going to make a variable that admin users can change, if they want to be able to make someone available to order it
    </button>
  </div>
</template>


