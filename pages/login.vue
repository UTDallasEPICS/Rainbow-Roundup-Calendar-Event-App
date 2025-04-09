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
  <div>
    <p>Sign in with your email to receive a magic link:</p>
    <input
      v-model="email"
      type="email"
      placeholder="you@example.com"
      class="border rounded p-2 mb-2 w-full"
    />
    <button
      @click="handleMagicLinkSignIn"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Send Magic Link
    </button>
  </div>
</template>
