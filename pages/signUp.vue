<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-white dark:text-gray-900">
    <form @submit.prevent="submitSignupForm"
      class="w-full max-w-xl mx-auto flex flex-col items-center justify-center bg-white p-6 sm:p-10 rounded-2xl">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8">
        Hello and Welcome!
      </h2>

      <div class="space-y-6 w-full">
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
          <NuxtLink to="/login" class="text-[#C028B9] hover:underline transition">
            Sign In
          </NuxtLink>
        </strong>
      </div>

      <!-- Register Button -->
      <button type="submit"
        class="mt-8 w-full sm:w-[300px] py-4 px-6 text-xl text-white font-semibold bg-[#C028B9] hover:bg-[#9a1985] transition rounded-2xl">
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

const errors = ref({});
const successMessage = ref("");
const signupModel = ref({
  email: "",
  firstname: "",
  lastname: "",
  role: "USER",
  phoneNum: "",
  emailNotif: false,
});

const submitSignupForm = async () => {
  errors.value = {};
  signupModel.value.email = signupModel.value.email.toLowerCase();
  const userDataToSubmit = { ...signupModel.value };
  try {
    const { data, error } = await useFetch("/api/user", { // todo: change to $fetch
      method: "POST",
      body: userDataToSubmit,
      watch: false,
    });
    if (data?.value?.success && !error.value) {
      router.push("login");
      successMessage.value = "A verification email has been sent to your address. Please check your inbox to complete registration.";
    } else {
      successMessage.value = 'Signup failed, check that you do not already have an account';
      console.error("Error submitting signup form");
      errors.value = { error: "Signup failed." };
    }
  } catch (err) {
    console.error("Error submitting signup form", err);
    errors.value = { error: "Something went wrong during signup." };

  }
};
</script>
