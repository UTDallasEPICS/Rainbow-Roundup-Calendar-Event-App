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
      <!-- Profile Picture Upload with Preview -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />
        <div v-if="imageUrl" class="mt-4 flex justify-center">
          <img
            :src="imageUrl"
            alt="Profile Preview"
            class="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      <!-- First Name -->
      <div>
        <label class="block text-md font-semibold text-gray-800 mb-2"
          >First Name</label
        >
        <input
          type="text"
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
  </form>
</template>

<script setup lang="ts">
const router = useRouter();

const file = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const errors = ref({});

const signupModel = ref({
  email: "",
  firstname: "",
  lastname: "",
  role: "USER",
  phoneNum: "",
  profilePic: "",
  GlobalNotif: false,
});

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    file.value = input.files[0];
    previewImage(file.value);
  }
}

function previewImage(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    imageUrl.value = reader.result as string;
  };
  reader.readAsDataURL(file);
}

async function uploadToS3(file: File) {
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

const submitSignupForm = async () => {
  errors.value = {};
  try {
    if (file.value) {
      const uploadedUrl = await uploadToS3(file.value);
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
      errors.value = { error: "Signup failed." };
    }
  } catch (err) {
    console.error("Error submitting signup form", err);
    errors.value = { error: "Something went wrong during signup." };
  }
};
</script>