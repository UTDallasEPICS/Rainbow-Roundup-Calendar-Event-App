<script lang="ts" setup>
definePageMeta({
  middleware: "sidebase-auth",
});

const { status, data, signOut } = useAuth();
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300"
  >
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full text-center">
      <template v-if="data">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          Welcome back,
          <span class="text-blue-600">{{ data.user.firstname }}</span
          >!
        </h1>
        <p class="text-sm text-gray-500 mb-6">We're glad to see you again.</p>
        <div class="border-t border-gray-200 pt-4">
          <Calendar :user="data.user" />
        </div>
        <button
          @click="signOut"
          class="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sign Out
        </button>
      </template>
      <template v-else>
        <h1 class="text-xl font-semibold text-gray-700 mb-4">
          You are not logged in.
        </h1>
        <p class="text-sm text-gray-500">
          Please sign in to access your calendar.
        </p>
      </template>
    </div>
  </div>
</template>
