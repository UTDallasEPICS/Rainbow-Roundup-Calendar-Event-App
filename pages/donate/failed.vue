<script setup lang="ts">
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="p-2">
    <div
      class="h-screen flex flex-col items-center justify-center text-center px-10 gap-6"
    >
      <div
        class="bg-red-300 w-24 h-24 flex items-center justify-center rounded-full"
      >
        <XMarkIcon class="h-12 w-12 text-red-500" />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-400">
          Looks like something went wrong while processing your request.
        </p>
        <h1 class="text-l text-[#3D3745] font-bold">
          Oh Snap! Donation Failed
        </h1>
        <div class="flex flex-col gap-4">
          <NuxtLink to="/donate">
            <button
              type="submit"
              class="bg-red-500 text-white px-4 py-1.5 rounded-xl text-center whitespace-nowrap block w-full hover:bg-red-600"
              aria-label="Retry Donation"
            >
              Please Try Again
            </button>
          </NuxtLink>

          <NuxtLink to="/">
            <button
              class="px-4 py-1.5 rounded-xl text-center whitespace-nowrap w-full flex items-center justify-center gap-2 hover:bg-gray-100"
              aria-label="Back to Home"
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
