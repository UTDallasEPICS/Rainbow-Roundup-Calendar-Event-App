<!--Profile page that will display user information unique to each UUID.
    Email and phone number fields will render conditionally based on user's role permission.  
-->

<template>
  <!-- navigating back arrow -->
  <div class="px-6 py-4 inline-flex items-center text-zinc-700 hover:text-zinc-900 hover:cursor-pointer" @click="$router.back()">
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

  <!-- no user found text-->
  <div v-if="userData == null && !loading" class="flex flex-col items-center" >
    <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>Unable to find user.</b></h1>
  </div>

  <!-- profile -->
  <div v-else class="flex flex-col items-center">
    <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>User Details</b></h1>

    <div class="flex flex-col items-center mt-4 mb-6">
      <!-- Fixed image path: public/ maps to root / -->
      <img class="w-40 h-40 rounded-full object-cover" :src="userData?.profilePic || '/public/default-profile.png'" alt="Profile Page">
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
    <!-- Report Modal -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm">
      <div class="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <div class="flex flex-col items-center mb-4">
          <img :src="userData?.profilePic || '/public/default-profile.png'" alt="User profile" class="w-24 h-24 rounded-full object-cover" />
          <p class="mt-2 text-lg font-semibold text-gray-800">{{ userData?.username }}</p>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <select v-model="reportReason" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none">
            <option disabled value="">-- Select a reason --</option>
            <option>Inappropriate Username</option>
            <option>Inappropriate Profile Picture</option>
            <option>Other</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea v-model="reportDescription" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none" placeholder="Write more details here..."></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showReportModal = false" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
          <button @click="submitReport" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Submit</button>
        </div>
      </div>
    </div>
    <div v-if="reportMessage" class="mt-4 text-center">
      <p
        :class="{
          'text-green-600': reportMessageType === 'success',
          'text-red-600': reportMessageType === 'error'
        }"
        class="font-semibold"
      >
        {{ reportMessage }}
      </p>
    </div>
    <!-- Delete section visible only to admin/super -->
    <div v-if="isAdmin" class="mt-6 mb-10 max-w-xl">
      <div v-if="!userData?.isArchived && !userData?.isBanned" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-bold">
        <button
          @click="banAccount"
        >
          Ban User
        </button>
      </div>
      
      <!-- unban account -->
      <div v-else-if="userData?.isBanned" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-bold">
        <button @click="revokeBan()">Revoke Ban</button>
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
  if (session && route.params.id) {
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
const banAccount = async () => {
  try {
    await $fetch(`/api/user/${route.params.id}`, {
        method: "PUT",
        body: {
          isBanned: true
        },
      });

    userData.isBanned = true;
  } catch (e) {
    console.error('Failed to ban account:', e)
  }
}

// Report modal state
const showReportModal = ref(false)
const reportReason = ref('')
const reportDescription = ref('')
const reportMessage = ref('')
const reportMessageType = ref('') // 'success' or 'error'

// Open report modal
const reportUser = () => {
  showReportModal.value = true
}

// Submit report handler
const submitReport = async () => {
  if (!reportReason.value) {
    alert('Please select a reason for reporting.')
    return
  }

  try {
    await $fetch('/api/report', {
      method: 'POST',
      body: {
        reportedUserId: userData.value?.id,
        description: reportDescription.value,
        isUsername: reportReason.value === 'Inappropriate Username',
        isProfilePic: reportReason.value === 'Inappropriate Profile Picture',
        isOther: reportReason.value === 'Other'
      }
    })
    reportMessage.value = 'Successfully submitted report.'
    reportMessageType.value = 'success'
  } catch (error) {
    console.error('Failed to submit report:', error)
    reportMessage.value = 'There was an error submitting your report.'
    reportMessageType.value = 'error'
  } finally {
    showReportModal.value = false
    reportReason.value = ''
    reportDescription.value = ''

    setTimeout(() => {
      reportMessage.value = ''
      reportMessageType.value = ''
    }, 20000)
  }
}
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
