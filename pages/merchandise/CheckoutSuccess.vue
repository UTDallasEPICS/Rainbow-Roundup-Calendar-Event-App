<template>
  <div class="max-w-2xl mx-auto p-6 text-center">
    <h1 class="text-2xl font-bold mb-4">{{ thankText }}</h1>
    <p class="text-gray-700 mb-6">
      Your order is being processed. This is a demo checkout — connect Stripe or your payment provider to complete
      payments.
    </p>

    <div class="mb-6">
      <button @click="goToHome" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">Continue shopping</button>
      <button @click="viewCart" class="px-4 py-2 bg-gray-100 rounded">View cart</button>
    </div>

    <div class="text-sm text-gray-500">
      <p v-if="paymentSuccess">Please check your email for confirmation. </p>
    </div>
    <div class="text-sm text-gray-500">
      <p v-if="errorMessage">Error: {{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
const thankText = ref("Verifying order...");
const route = useRoute();
const router = useRouter();
const cart = useCartStore()
const sessionId = await route.query.session_id
const errorMessage = ref("")
const paymentSuccess = ref(false)
onMounted(async () => {
  cart.clearCart() // clear cart since order is done
  console.log("Session id: ", route.query.session_id)
  try {
    const { session, error } = await $fetch("/api/stripe/verify", {
      method: "POST",
      body: {
        sessionId: sessionId
      },
    });
    if (error) {
      errorMessage.value = error
      console.log("Error: ", error)
    }
    if (session.payment_status === "paid") {
      thankText.value = "Thank you — order received!"
      paymentSuccess.value = true
    }
    else {
      errorMessage.value = "Could not receive session"
    }
    console.log("Stripe session: ",session)
  }
  catch { // Stripe will throw its own errors on the API endpoint, this is to handle that.
    errorMessage.value = "Cannot Verify Session"
  }
})

function goToHome() {
  router.push('/merchandise')
}
function viewCart() {
  router.push('/merchandise/cart')
}
</script>
