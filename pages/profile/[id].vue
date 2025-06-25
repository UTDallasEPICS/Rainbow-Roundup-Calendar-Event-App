<!--Profile page that will display user information unique to each UUID.
    Email and phone number fields will render conditionally based on user's role permission.  
 -->

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>Account Settings</b></h1>
    <div class="flex flex-col items-center mt-4 mb-6">
      <img class="w-40 h-40 rounded-full object-cover" src="../public/images/ProfileImage.png" alt="Profile Page">
    </div>

    <!--First name-->
    <div>
      <label class="block text-sm font-medium text-gray-700">First Name</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="text" id="first-name" v-model="firstName" readonly :class="inputClass" />
      </div>
    </div>

    <!--Last name-->
    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700">Last Name</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="text" id="last-name" v-model="lastName" readonly :class="inputClass" />
      </div>
    </div>

    <!--Phone number-->
    <div v-if="canViewPrivateFields">
      <label class="block mt-4 text-sm font-medium text-gray-700">Phone Number</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="tel" id="phone-number" v-model="phoneNumber" readonly :class="inputClass" />
      </div>
    </div>

    <!--Email-->
    <div v-if="canViewPrivateFields">
      <label class="block mt-4 text-sm font-medium text-gray-700">Email</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input type="email" id="email" v-model="email" readonly :class="inputClass" />
      </div>
    </div>

    <!--Delete-->
    <div v-if="isAdmin" class="mt-10 max-w-xl">
      <div class="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
        <div>
          <p class="text-md font-bold text-red-700">Delete this account?</p>
          <p class="text-sm text-red-500 mb-2">This action is permanent and cannot be undone.</p>
        </div>
        <button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl" @click="deleteAccount">
          Delete
        </button>
      </div>
    </div>

  </div>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const { status, data: session } = useAuth()
const route = useRoute()

// Reactive fetch based on current route param
const userData = ref(null)

// Anytime route.params.id changes, userData will update and roles will compute again
// THERE IS AN ISSUE HERE
const fetchUser = async () => {
  const { data } = await useFetch(() => `/api/user/${route.params.id}`, {
    credentials: 'include'
  })

  userData.value = data.value?.user || null
}

await fetchUser()

// This code would only run once when component first mounted, so every time
// you redirect to another profile, component does not reload.
// const id = route.params.id
// const { data, refresh } = await useFetch(`/api/user/${id}`)

// Refetch on route change (e.g., navigating to a new profile)
watch(
  () => route.params.id,
  async () => {
    await fetchUser()
  }
)

// Role checks
const isSelf = computed(() => {
  return session?.value?.user?.id === userData.value?.id
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

// Display fields as computed, to auto-update when userData changes
// Original method only copied the value once, never updated again
const firstName = computed(() => userData.value?.firstname ?? '')
const lastName = computed(() => userData.value?.lastname ?? '')
const phoneNumber = computed(() => userData.value?.phoneNum ?? '')
const email = computed(() => userData.value?.email ?? '')

const inputClass = 'px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed'

// Account deletion handler
const deleteAccount = async () => {
  try {
    await $fetch(`/api/user/${route.params.id}`, {
      method: 'DELETE'
    })
    return navigateTo('/', { redirectCode: 301 })
  } catch (e) {
    return e
  }
}
</script>
