<template>
    <div class="flex flex-col items-center">
        <h1 class="text-3xl font-bold text-[#022150] mt-6"><b>Account Settings</b></h1>
    <div class= "flex flex-col items-center mt-4 mb-6">
        <img class="w-40 h-40 rounded-full object-cover" src="../public/images/ProfileImage.png" alt="Profile Page">
    </div>

    <button class = "mb-6 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        @click = "editMode =!editMode">
        {{ editMode ? 'Save' : 'Edit' }}
    </button>

    <div>   
        <label class = "block text-sm font-medium text-gray-700">First Name</label>
        <div class = "flex space-x-6 mt-1 border-solid border-gray-700">
            <input
                type = "text"
                id = "first-name"
                v-model = "firstName"
                :readonly = "!editMode"
                :class = "inputClass"
            />
        </div>
    </div>

    <div>   
        <label class = "block mt-4 text-sm font-medium text-gray-700">Last Name</label>
        <div class = "flex space-x-6 mt-1 border-solid border-gray-700">
            <input
                type = "text"
                id = "last-name"
                v-model = "lastName"
                :readonly = "!editMode"
                :class = "inputClass"
            />
        </div>
    </div>

    <div>   
        <label class = "block mt-4 text-sm font-medium text-gray-700">Phone Number</label>
        <div class = "flex space-x-6 mt-1 border-solid border-gray-700">
            <input
                type = "tel"
                id = "phone-number"
                v-model = "phoneNumber"
                :readonly = "!editMode"
                :class = "inputClass"
            />
        </div>
    </div>

    <div>   
        <label class = "block mt-4 text-sm font-medium text-gray-700">Email</label>
        <div class = "flex space-x-6 mt-1 border-solid border-gray-700">
            <input
                type = "email"
                id = "email"
                v-model = "email"
                :readonly = "!editMode"
                :class = "inputClass"
            />
        </div>
    </div>

<div v-if = "editMode" class = "mt-10 max-w-xl">
    <div class = "bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
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

<div class="flex flex-col items-center">
<br>
<button class="w-[264px] border-none text-white text-lg text-center cursor-pointer mt-3 py-4 rounded-xl bg-red-500 hover:bg-red-600"><a href="./login">Log Out</a></button>
</div>

</div>
    
</template>

<script setup>
import { ref, computed } from 'vue'

const editMode = ref(false)

const inputClass = computed(() =>
  editMode.value
    ? 'px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-400'
    : 'px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed'
)

const route = useRoute();

console.log(route.params.id);

const id = route.params.id

const {data, refresh} = await useFetch(`/api/user/${id}`)

const userData = ref(data.value.User);

const firstName = ref(userData.value.firstname)
const lastName = ref(userData.value.lastname)
const phoneNumber = ref(userData.value.phoneNumber)
const email = ref(userData.value.email)

</script>
