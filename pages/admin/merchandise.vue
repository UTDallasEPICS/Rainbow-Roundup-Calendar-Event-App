<template>
    <div class="min-h-screen bg-gray-100 flex items-start justify-center p-8">
        <div class="max-w-4xl px-6 py-4">
            <!-- header -->
            <div class="flex flex-row items-center">
                <NuxtLink to="/admin" class="self-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                />
                </svg> </NuxtLink>
                <span class="text-2xl font-bold text-zinc-700">
                    Manage Merchandise
                </span>
            </div>
         
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";


</script>