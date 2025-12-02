<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
        <!-- navigating back arrow -->
        <div class="w-full px-6 py-4 inline-flex hover:text-zinc-900 hover:cursor-pointer" @click="$router.back()">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
                />
            </svg>
            <p>Back</p>
        </div>

        <div class="w-full max-w-4xl flex flex-col items-center">
         
            <div v-if="isLoading">
                <h1 class="text-gray-400">Loading...</h1>
            </div>
            <div v-else-if="order == null || order == undefined || !order">
                <h1 class="text-3xl font-bold mt-6"><b>Unable to find order.</b></h1>
            </div>
            <div v-else-if="!isAdmin || !isSelf">
                <h1 class="text-3xl font-bold mt-6"><b>Unauthorized.</b></h1>
            </div>
            <div v-else class="w-full my-6 space-y-3"> 
                <!-- title -->
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl col-span-1 font-bold">
                        <p>Order ID</p>
                        <p>{{ order.id }}</p>
                    </h1>
                    <div v-if="isAdmin" class="text-right">
                        <button class="bg-blue-300 p-2 rounded-md font-bold hover:bg-blue-400 cursor-pointer transition duration-150" @click="">
                            Edit
                        </button>
                    </div>
                </div>
                <!-- box -->
                <div class="w-full my-3 rounded-lg bg-white">
                    <!-- header color -->
                    <div class="h-8 bg-blue-300 rounded-t-lg"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2">
                        <!-- left side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <div>
                                <h2 class="text-lg font-bold">Customer Name</h2>
                                <p>{{ order.User.firstname }} {{ order.User.lastname }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Contact Information</h2>
                                <p>{{ order.User.email }}</p>
                                <p v-if="order.User.phone != null && order.User.phone != ''">{{ order.User.phone }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Placed At</h2>
                                <p>{{ formatDateTime(order.placedAt) }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Order Status</h2>
                                <p>{{ order.status }}</p>
                            </div>
                            <!-- order list -->
                            <div>
                                <h2 class="text-lg font-bold">Items</h2>
                                <div class="grid grid-cols-3">
                                    <div class="col-span-1 font-bold">
                                        Item
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Quantity
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Price
                                    </div>
                                </div>
                                <div v-for="item in order.OrderItems" class="grid grid-cols-3">
                                    <div class="col-span-1">
                                        {{ item.ItemVariants.item.name }} - {{ item.ItemVariants.size }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        {{ item.quantity }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ (item.ItemVariants.item.price * item.quantity).toFixed(2) }}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 border-t-2">
                                    <div class="col-span-1 font-bold">
                                        Total
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ totalOrderPrice.toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- right side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <!-- <div v-if="">

                            </div> -->
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Access the route and router
const route = useRoute()
const router = useRouter()

// Get user session using better Auth composable
import { authClient } from "~/server/auth"
const { data: session } = await authClient.getSession();
// Reactive user data and loading state
const order = ref(null)
const isLoading = ref(true)
const totalOrderPrice = ref(0)


// Fetch user info from API

isLoading.value = true
try {
    const response = await useFetch(`/api/order/${route.params.id}`, {
        query: {
        method: "GET"
        }
    })
    order.value = response.data.value.data
    console.log(order)
    calculateOrderPrice()
} catch (e) {
    console.error('Failed to fetch order:', e)
    order.value = null
} finally {
    isLoading.value = false
}

// Role-based computed permissions
const isSelf = computed(() => {
  return session.user?.id === order.value?.User.id
})

const isAdmin = computed(() => {
  const role = session.user?.role
  if (!role) return false
  if (role === 'SUPER') return true
  if (role === 'ADMIN' && targetRole !== 'ADMIN') return true
  return false
})

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    fractionalSecondDigits: 3
  });
}


function calculateOrderPrice() { 
    let price = 0;

    for (let i = 0; i < order.value.OrderItems.length; i++) {
        price += (order.value.OrderItems[i].ItemVariants.item.price * order.value.OrderItems[i].quantity);
    }

   totalOrderPrice.value = price;

}
</script>
