<template>
    <div>
      <h1 class="text-4xl">HELLO</h1>
    </div>
    <ClientOnly>
      PWA Installed: {{ $pwa?.isPWAInstalled }}
    </ClientOnly>
  </template>
  
  <script setup lang="ts">
  </script>
  