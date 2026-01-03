<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Your Cart</h1>
      <button @click="continueShopping" class="text-black border-2 border-black bg-blue-400 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors duration-200">
        Continue Shopping
      </button>
    </div>

    <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items list -->
      <div class="lg:col-span-2 space-y-6">
        <div v-for="item in cartItems" :key="item.variantId" class="flex justify-between items-start border-b pb-6">
          <div class="flex gap-4">
            <img :src="item.image || '/images/tshirt.png'" :alt="item.name" class="w-24 h-24 object-cover rounded">
            <div>
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-gray-600 text-sm">{{ item.description }}</p>

              <div class="flex items-center mt-2">
                <button @click="decrement(item.variantId)" class="px-2 border rounded-l">-</button>
                <span class="px-4 border-t border-b">{{ item.quantity }}</span>
                <button @click="increment(item.variantId)" class="px-2 border rounded-r">+</button>
                <button @click="remove(item.variantId)" class="text-red-500 text-sm ml-4">Remove</button>
              </div>
            </div>
          </div>

          <div class="text-right">
            <p class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <aside class="bg-gray-50 p-6 rounded-lg lg:w-full">
        <h2 class="text-xl font-bold mb-6">ORDER SUMMARY</h2>

        <div class="space-y-4 mb-6">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
        </div>

        <button @click="checkout" class="w-full bg-green-400 text-white py-3 rounded-md font-bold mb-4 hover:bg-green-600 transition-colors">
          Checkout
        </button>

        <button v-if="cartItems.length > 0" @click="clearCart" class="w-full bg-red-100 text-red-600 py-2 rounded-md font-semibold">
          Clear Cart
        </button>

        <p class="text-xs text-gray-500 mt-4">Powered by Stripe</p>
      </aside>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-lg">Your cart is empty</p>
      <button @click="continueShopping" class="mt-4 text-black border-2 border-black bg-blue-400 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors duration-200">
        Continue Shopping
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const cart = useCartStore()

//Need to ask Kimberly about if Tax is included or not

const cartItems = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)

// action helpers
function increment(variantId: string) {
  cart.changeQuantityBy(variantId, 1)
}
//Minus quantity
function decrement(variantId: string) {
  cart.changeQuantityBy(variantId, -1)
}
//Take out the one item
function remove(variantId: string) {
  cart.removeItem(variantId)
}
//calls function in cart
function clearCart() {
  cart.clearCart()
}
//go back to merchandise index.vue
function continueShopping() {
  router.push('/merchandise')
}
//checks to see if checkout is availble
function checkout() {
  if (cart.items.length === 0) {
    alert('Your cart is empty!')
    return
  }
  // Make a checkout page soon (might also change path)
  router.push('/merchandise/checkout')
}
</script>
