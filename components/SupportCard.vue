<template>
  <div 
    class="relative h-48 rounded-[20px] shadow-lg p-6 flex flex-col"
    :class="bgColor"
  >
    <div class="flex-1 flex flex-col justify-center">
      <div class="text-2xl font-semibold mb-2" :class="titleColor">
        {{ title }}
      </div>
      <div class="text-sm" :class="descriptionColor">
        {{ description }}
      </div>
    </div>
    
    <a
      v-if="externalLink"
      :href="externalLink"
      target="_blank"
      rel="noopener noreferrer"
      class="w-24 h-10 text-white text-sm font-semibold uppercase rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      :class="buttonColor"
    >
      {{ buttonText }}
    </a>
    
    <NuxtLink v-if="internalLink && !externalLink" :to="internalLink">
      <button 
        class="w-24 h-10 text-white text-sm font-semibold uppercase rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        :class="buttonColor"
      >
        {{ buttonText }}
      </button>
    </NuxtLink>
    
    <button 
      v-if="!externalLink && !internalLink"
      class="w-24 h-10 text-white text-sm font-semibold uppercase rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      :class="buttonColor"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: 'bg-white'
  },
  titleColor: {
    type: String,
    default: 'text-slate-900'
  },
  descriptionColor: {
    type: String,
    default: 'text-slate-600'
  },
  buttonColor: {
    type: String,
    default: 'bg-slate-500'
  },
  externalLink: {
    type: String,
    default: null
  },
  internalLink: {
    type: String,
    default: null
  }
})
</script>