<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-white dark:text-gray-900">
    <form @submit.prevent="submitSignupForm"
      class="w-full max-w-xl mx-auto flex flex-col items-center justify-center bg-white p-6 sm:p-10 rounded-2xl">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8">
        Hello and Welcome!
      </h2>

      <div class="space-y-6 w-full">
        <!-- Profile Picture Upload with Preview -->
        <div class="flex flex-col items-center space-y-4">
          <label class="text-lg font-semibold text-gray-800">
            Upload Profile Picture
          </label>

          <!-- Upload Box -->
          <div
            class="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <input type="file" accept="image/*" @change="handleFileChange"
              class="absolute inset-0 opacity-0 cursor-pointer" />
            <div v-if="!imageUrl" class="text-center text-gray-500 text-sm">
              Click to Upload
            </div>
            <img v-if="imageUrl" :src="imageUrl" alt="Profile Preview"
              class="w-full h-full object-cover rounded-full" />
          </div>

          <!-- Remove button -->
          <button v-if="imageUrl" @click="removeImage" class="text-sm text-red-500 hover:underline">
            Remove Photo
          </button>
        </div>
        <div v-if="profilePictureError" class="text-red-600 mt-4 text-center">
          {{ profilePictureError }}
        </div>

        <!-- First Name -->
        <div>
          <label class="block text-md font-semibold text-gray-800 mb-2">First Name</label>
          <input type="text" v-model="signupModel.firstname"
            class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-md font-semibold text-gray-800 mb-2">Last Name</label>
          <input type="text" v-model="signupModel.lastname"
            class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-md font-semibold text-gray-800 mb-2">Email</label>
          <input type="email" v-model="signupModel.email"
            class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-md font-semibold text-gray-800 mb-2">Phone Number</label>
          <input type="tel" v-model="signupModel.phoneNum"
            class="w-full px-4 py-3 text-md rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
        </div>
      </div>

      <!-- Already have account -->
      <div class="text-md mt-6 text-center text-gray-600">
        <strong>
          Already have an account?
          <NuxtLink to="/login" class="text-[#D97ED5] hover:underline transition">
            Sign In
          </NuxtLink>
        </strong>
      </div>

      <!-- Register Button -->
      <button type="submit"
        class="mt-8 w-full sm:w-[300px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl">
        Register
      </button>
      <!-- Success message -->
      <div v-if="successMessage" class="text-red-600 mt-4 text-center">
        {{ successMessage }}
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">

const router = useRouter();

function removeImage() {
  file.value = null;
  imageUrl.value = null;
}


const file = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const errors = ref({});
const successMessage = ref("");
const profilePictureError = ref("")
const signupModel = ref({
  email: "",
  firstname: "",
  lastname: "",
  role: "USER",
  phoneNum: "",
  profilePic: "",
  emailNotif: false,
});

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!input.files?.[0]) {
    return
  }
  if(input.files?.[0].size > 256 * 1024){
    profilePictureError.value = "Profile pictures should be under 256KB in size"
    return
  }
  if(!allowedTypes.includes(input.files?.[0].type)){
    profilePictureError.value = "Profile picture type unsupported, please use either jpeg or png"
    return
  }
  profilePictureError.value = ""
  file.value = input.files[0];
  previewImage(file.value);
}

function previewImage(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    imageUrl.value = reader.result as string;
  };
  reader.readAsDataURL(file);
}

async function uploadToS3(file: File) {
  if(!file?.name){
    return null
  }
  const formData = new FormData();
  formData.append("file", file);

  const res = await $fetch("/api/user/profile_picture", {
    method: "POST",
    body: formData,
    ignoreResponseError: true, // <- prevents $fetch from throwing
  });

  if (res?.error) {
    profilePictureError.value = res.error;
    throw new Error(res.error);
  }
  else{
    return res.fileUrl;
  }
}

const submitSignupForm = async () => {
  errors.value = {};
  signupModel.value.email = signupModel.value.email.toLowerCase();
  const userDataToSubmit = { ...signupModel.value };
  try {
    try {
      const uploadedUrl = await uploadToS3(file.value);
      userDataToSubmit.profilePic = uploadedUrl;
      console.log("url: ", uploadedUrl)
      console.log("userSubmit: ", userDataToSubmit)
    } catch (uploadError) {
      console.error("Profile picture upload failed:", uploadError);
      return
    }

    console.log("User data: ",userDataToSubmit)
    
    const { data, error } = await useFetch("/api/user", { // todo: change to $fetch
      method: "POST",
      body: userDataToSubmit,
      watch: false,
    });
    if (data?.value?.success && !error.value) {


      router.push("login");
      successMessage.value = "A verification email has been sent to your address. Please check your inbox to complete registration.";
      // Optionally clear form fields here
    } else {
      successMessage.value = 'Signup failed, check that you do not already have an account';
      console.error("Error submitting signup form");
      errors.value = { error: "Signup failed." };
      if (error.value?.statusCode === 400) {
        navigateTo("/login");
        console.log("redirecting to login...");
        // if not already, their email will be autoverified on login, so might as well send them there
      }

    }
  } catch (err) {
    console.error("Error submitting signup form", err);
    errors.value = { error: "Something went wrong during signup." };

  }
};
</script>