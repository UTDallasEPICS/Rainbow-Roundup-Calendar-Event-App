<!--Profile page that will display user information unique to each UUID.
    Email and phone number fields will render conditionally based on user's role permission.  
-->

<template>
    <div class="min-h-screen text-zinc-700">
        <!-- navigating back arrow -->
        <div class="px-6 py-4 inline-flex items-center hover:text-zinc-900 hover:cursor-pointer" @click="$router.back()">
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

        <div class="w-full max-w-4xl flex flex-col items-center bg-white">
         
            <div v-if="isLoading">
                <h1 class="text-gray-400"">Loading...</h1>
            </div>
            <div v-else-if="order == null || order == undefined || !order">
                <h1 class="text-3xl font-bold mt-6"><b>Unable to find order.</b></h1>
            </div>
            <div v-else-if="!isAdmin || !isSelf">
                <h1 class="text-3xl font-bold mt-6"><b>Unauthorized.</b></h1>
            </div>
            <!-- originally i had it like this but idk why its not working lfmaofkasjdhakjdgwyafdgstyuhhxz -->
            <div v-else> 
                <!-- title -->
                <div class="my-4">
                    <h1 class="text-2xl mt-6 col-span-1 font-bold">
                        <p>Order ID</p>
                        <p>{{ order.id }}</p>
                    </h1>
                    <div class="text-right">
                            <button class="bg-blue-300 p-2 rounded-md font-bold hover:bg-blue-400 cursor-pointer transition duration-150" @click="">
                                Edit
                            </button>
                        </div>
                </div>
            </div>
            <!-- <div v-else>error</div> -->
            
            <!-- <div v-else-if="order == null || order == undefined || !order">
                <h1 class="text-3xl font-bold mt-6"><b>Unable to find order.</b></h1>
            </div>
            <div v-else-if="!isAdmin || !isSelf">
                <h1 class="text-3xl font-bold mt-6"><b>Unauthorized.</b></h1>
            </div> -->

            balls
            
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


// Fetch user info from API
const fetchOrder = async () => {
  isLoading.value = true
  try {
    console.log(route.params.id)
    const response = await useFetch(`/api/order/${route.params.id}`, {
      query: {
        method: "GET"
      }
    })
    order.value = response.data.value.data
  } catch (e) {
    console.error('Failed to fetch order:', e)
    order.value = null
  } finally {
    isLoading.value = false
  }
}

// Watch session and route param; fetch user only when both ready
// Check for proof of session and if user ID is known
watchEffect(async () => { 
  if (session && route.params.id) {
    await fetchOrder()
    console.log(order.value)
  }
  //console.log(order.value)
})

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

const canViewPrivateFields = computed(() => {
  return isSelf.value || isAdmin.value
})

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscapeKey)
})

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    showReportModal.value = false
  }
}

async function revokeBan() {
  await $fetch(`/api/user/${route.params.id}`, {
        method: "PUT",
        body: {
          isBanned: false
        },
      });

  userData.isBanned = false;
}
</script>
