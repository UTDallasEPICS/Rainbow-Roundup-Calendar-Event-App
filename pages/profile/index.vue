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

  <!-- profile -->
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold text-[#022150] mt-6">
      <b>Account Settings</b>
    </h1>
    <div class="flex flex-col items-center mt-4 mb-6">
      <img
        class="w-40 h-40 rounded-full object-cover"
        :src="imageUrl || profilePic || '/default-profile.png'"
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
    <div>
      <label class="block mt-4 text-sm font-medium text-gray-700">Do you want to enable email notifications?</label>
      <div v-if="!editMode" class="flex space-x-6 mt-1 border-solid border-gray-700"> <!-- Run if not edit mode, can't edit toggle-->
        <input
          type="checkbox"
          id="emailNotif"
          v-model="emailNotif"
          :readonly="!editMode"
          :class="inputClass"
          ref="emailNotifRef"
          @click.stop.prevent="!editMode"
        />
      </div>
      <div v-if="editMode" class="flex space-x-6 mt-1 border-solid border-gray-700"> <!-- Run if edit mode, can edit toggle-->
        <input
          type="checkbox"
          id="emailNotif"
          v-model="emailNotif"
          :class="inputClass"
          ref="emailNotifRef"
        />
      </div>
      <label class="block mt-4 text-sm font-medium text-gray-700">Allow on device notifications?</label>
      <div v-if="!editMode" class="flex space-x-6 mt-1 border-solid border-gray-700"> <!-- Run if not edit mode, can't edit toggle-->
        <input
          type="checkbox"
          id="nativeNotif"
          v-model="nativeNotif"
          :readonly="!editMode"
          :class="inputClass"
          ref="nativeNotifRef"
          @click.stop.prevent="!editMode"
        />
      </div>
      <div v-if="editMode" class="flex space-x-6 mt-1 border-solid border-gray-700"> <!-- Run if edit mode, can edit toggle-->
        <input
          type="checkbox"
          id="nativeNotif"
          v-model="nativeNotif"
          :class="inputClass"
          ref="nativeNotifRef"
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
        @click="() => logout()"
      >
        Log Out
      </button>
    </div>
  </div>
</template>

<script  setup>
import { ref, computed } from "vue";
const editMode = ref(false);
definePageMeta({
  ssr: false   // page will be rendered purely on the client. I put this here since it keeps trying to render server side, breaking the auth
})
const inputClass = computed(() =>
  editMode.value
    ? "px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-400"
    : "px-3 py-2 rounded-xl focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
);
const firstName = ref(null);
const lastName = ref(null);
const phoneNum = ref(null);
const email = ref(null);
const profilePic = ref(null);
const emailNotif = ref(null);
const nativeNotif = ref(null);
const route = useRoute();
const id = route.params.id;
import { authClient } from "~/server/auth";
const { data: session } = await authClient.getSession();
const userData = ref(null);
const fetchUser = async () => { // This ensures that the api is called and the form filled only when the session is fully loaded
  try {
    const { data: response, error } = await useFetch(`/api/user/${session?.session.userId}`, {
      credentials: 'include'
    })
    userData.value = response.value?.user || null
    firstName.value = userData.value?.firstname;
    lastName.value = userData.value?.lastname;
    phoneNum.value = userData.value?.phoneNum;
    email.value = userData.value?.email;
    profilePic.value = userData?.value?.profilePic;
    emailNotif.value = userData?.value?.emailNotif;
    nativeNotif.value = userData?.value?.nativeNotif;
  } catch (e) {
    console.error('Failed to fetch user:', e)
    console.log("Redirecting cause not logged in")
  } finally {
    console.log("Loaded user")
  }
}
watchEffect(async () => {
  if (session) {
    console.log('Fetching session user:', session?.session.userId)
    await fetchUser()
    console.log('Fetched userData:', userData.value?.id)
  }
})

//const userData = response.value?.user || null


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
    await $fetch(`/api/user/${session.session.userId}`, {
      method: "DELETE",
    });
    await authClient.signOut();
    window.location.href = '/'
  } catch (e) {
    return e;
  }
};
const logout = async () => {
  await authClient.signOut();
  window.location.href = '/login'
};

const saveAccount = async () => {
  try {
    let newProfilePic = profilePic.value;

    if (file.value) {
      newProfilePic = await uploadToS3(file.value);
      profilePic.value = newProfilePic;
    }

    await $fetch(`/api/user/${session.session.userId}`, {
      method: "PUT",
      body: {
        firstname: firstName.value,
        lastname: lastName.value,
        phoneNum: phoneNum.value,
        email: email.value,
        profilePic: newProfilePic,
        emailNotif: emailNotif.value,
        nativeNotif: nativeNotif.value,
      },
    });
  } catch (e) {
    console.error("Save failed", e);
    return e;
  }
};
</script>
