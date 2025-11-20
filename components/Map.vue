<script setup lang='ts'>
import { computed } from "vue";

const props = defineProps(["address"])
const config = useRuntimeConfig();
const apiKey = config.public.NUXT_GOOGLE_PLACES;

const embedFrame = computed(() => {
  if (!props.address) {
    return ""
  }

  const string = "https://www.google.com/maps/embed/v1/place?q=" + props.address + "&key=" + apiKey
  return string
})
</script>

<template>
    <iframe v-if="props.address" class="w-full h-1/4vh border-0" loading="lazy" allowfullscreen :src="embedFrame">
    </iframe>
</template>
