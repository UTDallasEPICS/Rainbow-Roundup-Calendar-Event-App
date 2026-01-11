<template>
  <div class="max-w-2xl mx-auto p-6 text-center">
    <h1 class="text-2xl font-bold mb-4">{{ thankText }}</h1>
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
    <div class="text-sm text-gray-500">
      <p v-if="errorMessage">Error: {{errorMessage}}</p>
    </div>
    <div class="text-sm text-gray-500">
      <p>{{errorMessage}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
const thankText = ref("");
const route = useRoute();
const router = useRouter();
const cart = useCartStore()
const sessionId = await route.query.session_id
const errorMessage = ref("")
onMounted(async () => {
  // Clear local cart on success (in production, prefer server/webhook confirmation)
  thankText.value = "Verifying order"
  cart.clearCart()
  console.log("Session id: ", route.query.session_id)
  const {session, error} = await $fetch("/api/stripe/verify",{
    method: "POST",
    body: {
      sessionId: sessionId
    },
  });
  console.log("Stripe session: ",session)
  if(error){
    errorMessage.value = error
    console.log("Error: ", error )
  }
  if(session){
    thankText.value = "Thank you — order received!"
  }
  else{
    errorMessage.value = "Could not receive session"
  }
  
})

function goToHome() {
  router.push('/merchandise')
}
function viewCart() {
  router.push('/merchandise/cart')
}
</script>
