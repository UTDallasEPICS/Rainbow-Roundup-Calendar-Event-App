<!--Profile page that will display user information unique to each UUID.
    Email and phone number fields will render conditionally based on user's role permission.  
 -->

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>Account Settings</b></h1>
        <div class="flex flex-col items-center mt-4 mb-6">
            <img class="w-40 h-40 rounded-full object-cover" src="../public/images/ProfileImage.png" alt="Profile Page">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <div class="flex space-x-6 mt-1 border-solid border-gray-700">
                <input type="text" id="first-name" v-model="firstName" readonly :class="inputClass" />
            </div>
        </div>

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

        <div v-if="isAdmin" class="mt-10 max-w-xl">
            <div class="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
                <div>
                    <p class="text-md font-bold text-red-700">Delete this account?</p>
                    <p class="text-sm text-red-500 mb-2">This action is permanent and cannot be undone.</p>
                </div>
                <button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl"
                    @click="deleteAccount">
                    Delete
                </button>
            </div>
        </div>

    </div>

</template>

<script setup>

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const { status, data: session } = useAuth()


// checks what role user is
const isSelf = computed(() => session?.value?.user?.id === userData.value.id)

// checks if user is an admin
const isAdmin = computed(() => {
    const role = session?.value?.user?.role
    const targetRole = userData.value.role
    if (role === 'SUPER') return true
    if (role === 'ADMIN' && targetRole !== 'ADMIN') return true
    return false
})
// checks if user has permission to view other user's profile information
const canViewPrivateFields = computed(() => isSelf.value || isAdmin.value)

const inputClass = 'px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed'

const route = useRoute();

const id = route.params.id

const { data, refresh } = await useFetch(`/api/user/${id}`)

const userData = ref(data.value.User);

const firstName = ref(userData.value.firstname)
const lastName = ref(userData.value.lastname)
const phoneNumber = ref(userData.value.phoneNum)
const email = ref(userData.value.email)

const deleteAccount = async () => {
    try {
        await $fetch(`/api/user/${id}`,
            {
                method: 'DELETE'
            });

        return navigateTo('/', { redirectCode: 301 })
    } catch (e) {
        return e
    }

}

</script>
