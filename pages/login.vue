<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const { signIn } = useAuth();
const email = ref("");

const handleMagicLinkSignIn = () => {
  if (!email.value) return;
  signIn("email", { email: email.value, callbackUrl: "/" });
};
</script>

<template>
  <div
    class="w-full min-h-screen flex items-center justify-center bg-white px-6 py-12"
  >
    <form
      @submit.prevent="handleMagicLinkSignIn"
      class="w-full max-w-xl rounded-2xl p-8 sm:p-10 flex flex-col items-center"
    >
      <h2
        class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8"
      >
        Welcome Back
      </h2>

      <!-- Email Field -->
      <div class="w-full">
        <label class="block text-lg font-semibold text-gray-800 mb-2"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition"
        />
      </div>

      <!-- Send Magic Link Button -->
      <button
        type="submit"
        class="mt-8 w-full sm:w-[280px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl"
      >
        Send Magic Link
      </button>

      <!-- Optional error message -->
      <!--
      <div v-if="errors?.error" class="mt-4 text-red-600 text-lg font-semibold">
        {{ errors.error }}
      </div>
      -->

      <!-- Sign Up Link -->
      <div class="text-lg mt-6 text-center text-gray-600">
        <strong>
          Don't have an account?
          <a href="./signUp" class="text-[#D97ED5] hover:underline transition"
            >Sign Up</a
          >
        </strong>
      </div>
    </form>
  </div>
</template>
