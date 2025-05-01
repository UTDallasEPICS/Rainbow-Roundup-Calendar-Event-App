<template>
  <form
    @submit.prevent="submitSignupForm"
    class="w-full max-w-xl mx-auto flex flex-col items-center justify-center bg-white p-6 sm:p-10 rounded-2xl"
  >
    <h2
      class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8"
    >
      Hello and Welcome!
    </h2>

    <div class="space-y-6 w-full">
      <!-- Profile Picture Upload -->
      <!-- <div>
        <label class="block text-md font-semibold text-gray-800 mb-2">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />
      </div> -->

      <!-- First Name -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2"
          >First Name</label
        >
        <input
          type="text"
          id="first-name"
          v-model="signupModel.firstname"
          class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2"
          >Last Name</label
        >
        <input
          type="text"
          id="last-name"
          v-model="signupModel.lastname"
          class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2"
          >Email</label
        >
        <input
          type="email"
          id="email"
          v-model="signupModel.email"
          class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition"
        />
      </div>

      <!-- Phone Number -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2"
          >Phone Number</label
        >
        <input
          type="tel"
          v-model="signupModel.phoneNum"
          class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition"
        />
      </div>
    </div>

    <!-- Already have account -->
    <div class="text-md mt-6 text-center text-gray-600">
      <strong>
        Already have an account?
        <a href="./login" class="text-[#D97ED5] hover:underline transition">
          Sign In
        </a>
      </strong>
    </div>

    <!-- Register Button -->
    <button
      type="submit"
      class="mt-8 w-full sm:w-[300px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl"
    >
      Register
    </button>

    <!-- Error Message -->
    <div v-if="errors?.error" class="mt-4 text-red-600 text-md font-semibold">
      {{ errors.error }}
    </div>
  </form>
</template>

<script setup>
import { useFetch } from "#app";

const router = useRouter();
const selectedFile = ref(null);

const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0];
};

const signupModel = ref({
  email: "",
  firstname: "",
  lastname: "",
  role: "USER",
  phoneNum: "",
  profilePic: "",
  GlobalNotif: false,
});

const errors = ref({});
const uploadToS3 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload-profile-pic", {
    method: "POST",
    body: formData,
  });
  const { url } = await res.json();
  return url;
};

const submitSignupForm = async () => {
  errors.value = {};
  try {
    if (selectedFile.value) {
      const uploadedUrl = await uploadToS3(selectedFile.value);
      signupModel.value.profilePic = uploadedUrl;
    }

    const { data, error } = await useFetch("/api/user", {
      method: "POST",
      body: signupModel.value,
      watch: false,
    });

    if (data?.value?.success) {
      router.push("login");
    } else {
      errors.value = { error: data?.value?.error };
    }
  } catch (err) {
    console.error("Error in submitting signup form", err);
  }
};
</script>
