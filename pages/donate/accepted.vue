<script setup lang="ts">
import { ArrowLeftIcon, CheckIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="p-2">
    <div
      class="h-screen flex flex-col items-center justify-center text-center px-10 gap-6"
    >
      <div
        class="bg-green-300 w-24 h-24 flex items-center justify-center rounded-full"
      >
        <CheckIcon class="h-12 w-12 text-green-500" />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-400">
          Thank you for your kindness! Your generosity will be shared.
        </p>
        <h1 class="text-l text-[#3D3745] font-bold">
          Congrats! Your charity money has been transferred
        </h1>
        <div class="flex flex-col gap-4">
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-1.5 rounded-xl text-center whitespace-nowrap block w-full hover:bg-green-600"
            aria-label="View your Transactions"
          >
            View your Transactions
          </button>
          <NuxtLink to="/">
            <button
              class="px-4 py-1.5 rounded-xl text-center whitespace-nowrap w-full flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeftIcon class="h-5 w-5 text-gray-500" />
              <p>Back to home</p>
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
