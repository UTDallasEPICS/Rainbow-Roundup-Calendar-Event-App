<!--Profile page that will display user information unique to each UUID.
    Email and phone number fields will render conditionally based on user's role permission.  
-->

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>Account Settings</b></h1>

    <div class="flex flex-col items-center mt-4 mb-6">
      <!-- Fixed image path: public/ maps to root / -->
      <img class="w-40 h-40 rounded-full object-cover" src="/images/ProfileImage.png" alt="Profile Page">
    </div>

    <!-- First name -->
     <!-- Changed all v-models to :value to only display data -->
    <div>
      <label class="block text-sm font-medium text-gray-700">First Name</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="text" id="first-name" :value="firstName" readonly :class="inputClass" />
      </div>
    </div>

    <!-- Last name -->
    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700">Last Name</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="text" id="last-name" :value="lastName" readonly :class="inputClass" />
      </div>
    </div>

    <!-- Phone number -->
    <div v-if="canViewPrivateFields">
      <label class="block mt-4 text-sm font-medium text-gray-700">Phone Number</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="tel" id="phone-number" :value="phoneNumber" readonly :class="inputClass" />
      </div>
    </div>
    <!-- Email -->
    <div v-if="canViewPrivateFields">
      <label class="block mt-4 text-sm font-medium text-gray-700">Email</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="email" id="email" :value="email" readonly :class="inputClass" />
      </div>
    </div>
    <!-- Report button: only show if viewing another user's profile -->
    <div v-if="!isSelf" class="mt-6">
      <button
        class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-xl"
        @click="reportUser"
      >
        Report
      </button>
    </div>
    <!-- Delete section visible only to admin/super -->
    <div v-if="isAdmin" class="mt-10 max-w-xl">
      <div class="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
        <div>
          <p class="text-md font-bold text-red-700">Delete this account?</p>
          <p class="text-sm text-red-500 mb-2">This action is permanent and cannot be undone.</p>
        </div>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl"
          @click="deleteAccount"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Access the route and router
const route = useRoute()
const router = useRouter()

// Get user session using Nuxt Auth composable
const { status, data: session } = useAuth()

// Reactive user data and loading state
const userData = ref(null)
const loading = ref(false)

// Fetch user info from API
const fetchUser = async () => {
  loading.value = true
  try {
    const { data: response, error } = await useFetch(`/api/user/${route.params.id}`, {
      credentials: 'include'
    })
    userData.value = response.value?.user || null
  } catch (e) {
    console.error('Failed to fetch user:', e)
    userData.value = null
  } finally {
    loading.value = false
  }
}

// Watch session and route param; fetch user only when both ready
// Check for proof of session and if user ID is known
watchEffect(async () => {
  if (session.value && route.params.id) {
    console.log('Fetching user for id:', route.params.id, 'with session user:', session.value?.user)
    await fetchUser()
    console.log('Fetched userData:', userData.value)
  }
})

// Role-based computed permissions
const isSelf = computed(() => {
  return session.value?.user?.id === userData.value?.id
})

const isAdmin = computed(() => {
  const role = session.value?.user?.role
  const targetRole = userData.value?.role
  if (!role || !targetRole) return false
  if (role === 'SUPER') return true
  if (role === 'ADMIN' && targetRole !== 'ADMIN') return true
  return false
})

const canViewPrivateFields = computed(() => {
  return isSelf.value || isAdmin.value
})

// Computed bindings for user fields with safe fallback
const firstName = computed(() => userData.value?.firstname ?? '')
const lastName = computed(() => userData.value?.lastname ?? '')
const phoneNumber = computed(() => userData.value?.phoneNum ?? '')
const email = computed(() => userData.value?.email ?? '')

// Shared input styling class
const inputClass = 'px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed'

// Handler for account deletion
const deleteAccount = async () => {
  try {
    await $fetch(`/api/user/${route.params.id}`, {
      method: 'DELETE'
    })
    return router.push({ path: '/', replace: true })
  } catch (e) {
    console.error('Failed to delete account:', e)
  }
}
</script>
