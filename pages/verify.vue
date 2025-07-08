<template>
  <div class="text-center mt-12">
    <h1 class="text-2xl font-bold">Verifying Email...</h1>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="success" class="text-green-600 mt-4">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

interface VerifyResponse {
  success: boolean;
  error?: string;
}

const route = useRoute();
const router = useRouter();

const error = ref("");
const success = ref("");

onMounted(async () => {
  const token = route.query.token;
  if (!token || typeof token !== "string") {
    error.value = "Invalid verification link";
    return;
  }

  try {
    const res = await $fetch<VerifyResponse>("/api/verify", {
      method: "POST",
      body: { token },
    });

    if (res.success) {
      success.value = "Email verified! Redirecting to login...";
      setTimeout(() => router.push("/login"), 3000);
    } else if ("error" in res && typeof res.error === "string") {
      error.value = res.error;
    } else {
      error.value = "Verification failed";
    }
  } catch (err) {
    error.value = "Server error during verification";
    console.error(err);
  }
});
</script>
