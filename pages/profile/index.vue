<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold text-[#022150] mt-6">
      <b>Account Settings</b>
    </h1>
    <div class="flex flex-col items-center mt-4 mb-6">
      <img
        class="w-40 h-40 rounded-full object-cover"
        :src="imageUrl || profilePic || '../public/images/ProfileImage.png'"
        alt="Profile Page"
      />
      <input
        v-if="editMode"
        type="file"
        accept="image/*"
        @change="handleFileChange"
        class="mt-2"
      />
    </div>

    <button
      class="mb-6 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      @click="toggleEditMode"
    >
      {{ editMode ? "Save" : "Edit" }}
    </button>

    <div>
      <label class="block text-sm font-medium text-gray-700">First Name</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input
          type="text"
          id="first-name"
          v-model="firstName"
          :readonly="!editMode"
          :class="inputClass"
          ref="firstNameRef"
          @keydown.enter.prevent="focusNext(lastNameRef)""
        />
      </div>
    </div>

    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700"
        >Last Name</label
      >
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input
          type="text"
          id="last-name"
          v-model="lastName"
          :readonly="!editMode"
          :class="inputClass"
          ref="lastNameRef"
          @keydown.enter.prevent="focusNext(phoneNumberRef)"
        />
      </div>
    </div>

    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700"
        >Phone Number</label
      >
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input
          type="tel"
          id="phone-number"
          v-model="phoneNum"
          :readonly="!editMode"
          :class="inputClass"
          ref="phoneNumberRef"
          @keydown.enter.prevent="focusNext(emailRef)"
        />
      </div>
    </div>

    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700">Email</label>
      <div class="flex space-x-6 mt-1 border-solid border-gray-700">
        <input
          type="email"
          id="email"
          v-model="email"
          :readonly="!editMode"
          :class="inputClass"
          ref="emailRef"
          @keydown.enter.prevent="toggleEditMode"
        />
      </div>
    </div>

    <div v-if="editMode" class="mt-10 max-w-xl">
      <div class="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
        <div>
          <p class="text-md font-bold text-red-700">Delete this account?</p>
          <p class="text-sm text-red-500 mb-2">
            This action is permanent and cannot be undone.
          </p>
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
      <br />
      <button
        class="w-[264px] border-none text-white text-lg text-center cursor-pointer mt-3 py-4 rounded-xl bg-red-500 hover:bg-red-600"
        @click="() => signOut({ callbackUrl: '/login' })"
      >
        Log Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
definePageMeta({
   middleware: "sidebase-auth",
 });
const editMode = ref(false);

const inputClass = computed(() =>
  editMode.value
    ? "px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-400"
    : "px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
);

const route = useRoute();
const id = route.params.id;

const { status, data: session, signOut } = useAuth(); // We are deconstructing data from useAuth and renaming it to session.
const userID = session.value.user.id;

const { data, refresh } = await useFetch(`/api/user/${userID}`);
const userData = ref(data.value.user);

const firstName = ref(userData.value.firstname);
const lastName = ref(userData.value.lastname);
const phoneNum = ref(userData.value.phoneNum);
const email = ref(userData.value.email);
const profilePic = ref(userData.value.profilePic);

const file = ref(null);
const imageUrl = ref(null);

const firstNameRef = ref(null);
const lastNameRef = ref(null);
const phoneNumberRef = ref(null);
const emailRef = ref(null);

function focusNext(refEl){
  refEl?.focus();
}

function handleFileChange(e) {
  const input = e.target;
  if (input.files?.[0]) {
    file.value = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result;
    };
    reader.readAsDataURL(file.value);
  }
}

async function uploadToS3(file) {
  const { uploadUrl, fileUrl } = await $fetch("/api/user/profile_picture", {
    method: "POST",
    body: {
      fileName: `${Date.now()}-${file.name}`,
      fileType: file.type,
    },
  });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${res.status} - ${errorText}`);
  }

  return fileUrl;
}

const toggleEditMode = async () => {
  if (editMode.value) {
    await saveAccount();
  }
  editMode.value = !editMode.value;
};

const deleteAccount = async () => {
  try {
    await $fetch(`/api/user/${userID}`, {
      method: "DELETE",
    });
    return navigateTo("/", { redirectCode: 301 });
  } catch (e) {
    return e;
  }
};

const saveAccount = async () => {
  try {
    let newProfilePic = profilePic.value;

    if (file.value) {
      newProfilePic = await uploadToS3(file.value);
      profilePic.value = newProfilePic;
    }

    await $fetch(`/api/user/${userID}`, {
      method: "PUT",
      body: {
        firstname: firstName.value,
        lastname: lastName.value,
        phoneNum: phoneNum.value,
        email: email.value,
        profilePic: newProfilePic,
      },
    });
  } catch (e) {
    console.error("Save failed", e);
    return e;
  }
};
</script>
