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
  <div class="w-full flex flex-col items-center justify-center bg-white">
    <h2 class="text-3xl font-bold mt-2 text-center text-[#022150] w-full">
      Welcome Back
    </h2>
    <div class="mt-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <div class="flex space-x-6 mt-1 border-b border-gray-700">
          <!-- <input
            type="email"
            class="username px-3 py-2 rounded-md focus:outline-none"
            v-model="email"
            placeholder="you@example.com"
          /> -->
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="px-3 py-2 rounded-md focus:outline-none"
          />
        </div>
      </div>

      <br />

      <button
        @click="handleMagicLinkSignIn"
        class="w-[264px] border-none text-white text-lg text-center cursor-pointer mt-3 py-4 rounded-xl bg-lavenderPurple hover:bg-purple-400"
      >
        Send Magic Link
      </button>

      <!-- <div v-if="errors?.error" class="error-message">
        <span
          ><b>{{ errors.error }}</b></span
        >
      </div> -->
      <div class="flex flex-col items-center mt-2 text-neutral-400">
        <p>
          <b
            >Don't have an account?
            <a
              href="./signUp"
              class="text-[#D9A2FF] no-underline hover:underline"
              >Sign Up</a
            ></b
          >
        </p>
      </div>
    </div>
  </div>
</template>
