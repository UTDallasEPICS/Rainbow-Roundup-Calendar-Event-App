<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Checkout</h1>

    <div v-if="cartItems.length === 0" class="text-center py-12">
      <p class="text-lg mb-4">Your cart is empty.</p>
      <button @click="goBack" class="px-4 py-2 bg-blue-500 text-white rounded">Back to shop</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- LEFT: Form -->
      <section class="lg:col-span-2 bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">Contact & Shipping</h2>

        <form @submit.prevent="onPlaceOrder" novalidate>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium">Full name</span>
              <input v-model="form.name" required type="text" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block">
              <span class="text-sm font-medium">Email</span>
              <input v-model="form.email" required type="email" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block sm:col-span-2">
              <span class="text-sm font-medium">Address</span>
              <input v-model="form.address" required type="text" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block">
              <span class="text-sm font-medium">City</span>
              <input v-model="form.city" required type="text" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block">
              <span class="text-sm font-medium">Postal / ZIP</span>
              <input v-model="form.postal" required type="text" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block">
              <span class="text-sm font-medium">Country</span>
              <input v-model="form.country" required type="text" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <label class="block sm:col-span-2">
              <span class="text-sm font-medium">Phone (optional)</span>
              <input v-model="form.phone" type="tel" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>
          </div>

          <label class="flex items-center gap-2 mt-4">
            <input type="checkbox" v-model="saveInfo" class="h-4 w-4" />
            <span class="text-sm">Save my info for next time</span>
          </label>

          <div class="mt-6 flex gap-3 items-center">
            <button
              :disabled="placing || !formIsValid"
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-60"
            >
              {{ placing ? 'Placing order…' : 'Place order' }}
            </button>

            <button type="button" @click="goBack" class="px-4 py-2 bg-gray-100 rounded">Edit cart</button>

            <div v-if="error" class="text-red-600 ml-4">{{ error }}</div>
          </div>

          <p class="text-xs text-gray-500 mt-4">
            This is a demo checkout page. Stripe integration placeholder shown below.
          </p>

          <!-- Placeholder: where you'd call your backend to create a Stripe Checkout session -->
          <!--
            Example:
            const res = await fetch('/api/checkout/create-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: cart.items, shipping: form })
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          -->
        </form>
      </section>

      <!-- RIGHT: Order summary -->
      <aside class="bg-gray-50 p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">Order summary</h2>

        <ul class="space-y-4 mb-4">
          <li v-for="it in cartItems" :key="it.itemVariantId" class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <img :src="it.image || '/images/tshirt.png'" alt="" class="w-14 h-14 object-cover rounded" />
              <div>
                <div class="font-medium">{{ it.name }}</div>
                <div class="text-xs text-gray-600">{{ it.description }}</div>
                <div class="text-sm text-gray-700 mt-1">x{{ it.quantity }} × ${{ it.price.toFixed(2) }}</div>
              </div>
            </div>
            <div class="font-semibold">${{ (it.price * it.quantity).toFixed(2) }}</div>
          </li>
        </ul>

        <div class="border-t pt-4">
          <div class="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <!-- You can add taxes/shipping calculations here -->
          <div class="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const cart = useCartStore()

const cartItems = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)

const saveInfo = ref(false)
const placing = ref(false)
const error = ref<string | null>(null)
const orderId = ref(null)
const form = ref({
  name: '',
  email: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  phone: ''
})

const formIsValid = computed(() => {
  const f = form.value
  return !!(f.name && f.email && f.address && f.city && f.postal && f.country)
})

function goBack() {
  router.push('/merchandise')
}
const sendOrder = async() => {
  console.log("Order sending...")
  const orderItems=  [{itemVariantId: "rijvwfr",quantity: 1}, {itemVariantId: "b7794d73-68ba-4448-8f5e-f0b5b36a6b7c", quantity: 3}] // Create an item with /api/item post and get an itemVariantId from db, this probably won't work for you
  console.log("Cart items: ",cart.items)
  console.log("Order items: ", orderItems)
  const { error, data, success } = await $fetch("/api/order", {
    method: "POST",
    body: {
      orderItems:  cart.items,
      orderType: "SHIPPING",
      shippingAddress: "ttp343f6j586nehib9448hq1u0", // set this to an event id that exists in db
    },
  });
  console.log("Error: ", error)
  console.log('Data', data)
  console.log('Success', success)
  orderId.value = data?.id
}
async function getStripeSession() {
  if(!orderId.value){
    return {
      error: "No order ID"
    }
  }
  const {error, url} = await $fetch("/api/stripe",{
    method: "POST",
    body: {
      orderId: orderId.value
    },
  });
  if(error){
    return {
      error: error
    }
  }
  if(!url){
    return {
      error: "No stripe url"
    }
  }
  window.location.assign(url);
  //router.push(url)
}
async function onPlaceOrder() {
  if (!formIsValid.value) {
    error.value = 'Please complete the required fields.'
    return
  }
  if (cartItems.value.length === 0) {
    error.value = 'Cart is empty.'
    return
  }

  placing.value = true
  error.value = null

  try {
    // -----------------------------
    // PLACEHOLDER: Simulated checkout
    // Replace this block with a real backend call to create a Stripe session.
    // Example (server should return { url }):
    // const res = await fetch('/api/checkout/create-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ items: cart.items, shipping: form.value })
    // });
    // const data = await res.json();
    // if (data.url) window.location.href = data.url;
    // -----------------------------

    // Simulate short delay and success
    //await new Promise(resolve => setTimeout(resolve, 900))

    await sendOrder()
    console.log("Sent order to our server")
    console.log("Orderid: ",orderId.value)
    await getStripeSession()
    // For demo: go to success page and clear cart
    //router.push('/merchandise/CheckoutSuccess')
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Failed to place order'
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
/* small niceties */
</style>
