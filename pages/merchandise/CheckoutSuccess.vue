<template>
  <div class="max-w-2xl mx-auto p-6 text-center">
    <h1 class="text-2xl font-bold mb-4">Thank you — order received!</h1>
    <p class="text-gray-700 mb-6">
      Your order is being processed. This is a demo checkout — connect Stripe or your payment provider to complete payments.
    </p>

    <div class="mb-6">
      <button @click="goToHome" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">Continue shopping</button>
      <button @click="viewCart" class="px-4 py-2 bg-gray-100 rounded">View cart</button>
    </div>

    <div class="text-sm text-gray-500">
      <p>You'll receive an email confirmation when payment is completed (demo).</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const cart = useCartStore()

onMounted(() => {
  // Clear local cart on success (in production, prefer server/webhook confirmation)
  cart.clearCart()
})

function goToHome() {
  router.push('/merchandise')
}
function viewCart() {
  router.push('/merchandise/cart')
}
</script>
