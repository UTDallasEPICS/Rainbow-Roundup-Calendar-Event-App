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
        <h2 class="text-lg font-semibold mb-4">Please select order fulfillment options</h2>
        <div class="toggle">
          <input type="checkbox" id="toggle" v-model="isPickup" class="toggle-checkbox" />
          <label :for="isPickup ? 'pickup' : 'shipping'" @click="toggle" class="toggle-label"
            :style="{ backgroundColor: isPickup ? 'green' : 'blue' }">
            <span class="toggle-indicator" :class="{ 'pickup': isPickup, 'shipping': !isPickup }"></span>
          </label>
          <span class="toggle-text" style="margin-left: 10px">{{ isPickup ? 'Pickup' : 'Shipping' }}</span>
        </div>

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
      <div class="mt-6 flex gap-3 items-center">
        <button @click="onPlaceOrder" class="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-60">
          {{ placing ? 'Placing order…' : 'Place order' }}
        </button>

        <button type="button" @click="goBack" class="px-4 py-2 bg-gray-100 rounded">Edit cart</button>

        <div v-if="error" class="text-red-600 ml-4">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

// TODO: Implement the Event selection UI

const router = useRouter()
const cart = useCartStore()

const cartItems = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)

const isPickup = ref(true);
const toggleColor = ref("green")
function toggle() {
  isPickup.value = !isPickup.value;
}

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
const sendOrder = async () => {
  console.log("Order sending...")
  console.log("Cart items: ", cart.items)
  const shippingType = isPickup.value ? "PICKUP" : "SHIPPING"
  const { error, data, success } = await $fetch("/api/order", {
    method: "POST",
    body: {
      orderItems: cart.items,
      orderType: shippingType, // TODO: Add code later to handle pickup orders
      shippingAddress: "not collected yet", // This doesn't matter, will get overwritten later
      
    },
  });
  console.log("Error: ", error)
  console.log('Data', data)
  console.log('Success', success)
  orderId.value = data?.id
}
async function getStripeSession() {
  if (!orderId.value) {
    return {
      error: "No order ID"
    }
  }
  const { error, url } = await $fetch("/api/stripe", {
    method: "POST",
    body: {
      orderId: orderId.value,
      isPickup: isPickup.value
    },
  });
  if (error) {
    return {
      error: error
    }
  }
  if (!url) {
    return {
      error: "No stripe url"
    }
  }
  window.location.assign(url); // Go to stripe checkout page, assign *should* tell the browser to remember session history for this.
}
async function onPlaceOrder() {
  if (cartItems.value.length === 0) {
    error.value = 'Cart is empty.'
    return
  }
  placing.value = true
  error.value = null
  try {
    await sendOrder()
    console.log("Sent order to our server")
    console.log("Orderid: ", orderId.value)
    await getStripeSession()
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Failed to place order'
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
  /* This is in raw CSS cause of the animation for the pickup/shipping toggle. I also figured it would get confusing to do half the CSS in tailwind and half in raw CSS
  so everything is raw.
  NOTE: This only contains CSS for the toggle and nothing else*/ 
.toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-checkbox {
  display: none;
}

.toggle-label {
  width: 60px;
  height: 30px;
  border-radius: 15px;
  position: relative;
  transition: background-color 0.3s;
}

.toggle-indicator {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s;
}

.pickup {
  transform: translateX(30px);
  /* Move the indicator */
}

.shipping {
  transform: translateX(0);
}
</style>
