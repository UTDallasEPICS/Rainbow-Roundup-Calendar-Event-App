<!-- src/components/MakeEventCard.vue -->
<template>
    <form
      @submit.prevent="onSubmit"
      class="w-80 h-72 relative bg-white rounded-[20px]
             shadow-[0px_4px_4px_0px_rgba(80,85,136,0.25)]
             overflow-hidden p-4 box-border"
    >
      <!-- amber header bar -->
      <div class="absolute inset-x-4 top-4 h-16 bg-amber-300 rounded-[10px]"></div>
  
      <!-- date inputs -->
      <div class="absolute top-6 left-6 flex space-x-2">
        <input
          v-model="form.dateDay"
          type="number"
          min="1"
          max="31"
          placeholder="DD"
          class="w-11 h-11 bg-white/70 rounded-[10px] backdrop-blur-sm
                 text-red-400 text-center font-bold text-[15px]"
        />
        <input
          v-model="form.dateMonth"
          type="text"
          placeholder="MMM"
          class="w-14 h-11 bg-white/70 rounded-[10px] backdrop-blur-sm
                 text-red-400 text-center font-medium text-[10px] uppercase"
        />
      </div>
  
      <!-- title -->
      <input
        v-model="form.title"
        type="text"
        placeholder="Event Title"
        class="absolute top-24 left-6 w-[calc(100%-48px)] p-1
               text-black text-lg font-medium border-b border-gray-300"
      />
  
      <!-- location -->
      <div class="absolute top-36 left-6 flex items-center">
        <div class="w-4 h-4 mr-1 relative">
          <div class="w-3 h-3 absolute left-[2px] top-[0.7px]
                      bg-slate-500 outline outline-[1.5px] outline-offset-[-0.75px]"></div>
          <div class="w-1 h-1 absolute left-[6px] top-[4.7px]
                      bg-white outline outline-[1.5px] outline-offset-[-0.75px]"></div>
        </div>
        <input
          v-model="form.location"
          type="text"
          placeholder="Location"
          class="p-1 text-xs font-normal text-indigo-950 border-b border-gray-300"
        />
      </div>
  
      <!-- avatars preview & going -->
      <!-- <div class="absolute top-44 left-6 flex items-center space-x-2">
        <img
          v-for="(a,i) in form.avatars"
          :key="i"
          :src="a"
          class="w-6 h-6 rounded-full outline outline-1 outline-offset-[-0.5px] outline-white"
        />
        <input
          v-model.number="form.going"
          type="number"
          min="0"
          class="w-12 p-1 text-xs font-medium text-indigo-700 border-b border-gray-300"
        />
        <span class="text-xs text-indigo-700">Going</span>
      </div> -->
  
      <!-- description -->
      <textarea
        v-model="form.description"
        placeholder="Description…"
        class="absolute bottom-12 left-6 w-[calc(100%-48px)] h-16 p-2
               text-slate-600 text-xs border border-gray-200 rounded"
      ></textarea>
  
      <!-- delete & save buttons -->
      <button
        type="button"
        @click="$emit('cancel')"
        class="absolute bottom-4 left-6 px-4 py-1 bg-red-600/40 text-white text-xs font-semibold rounded-3xl shadow"
      >
        Delete
      </button>
      <button
        type="submit"
        class="absolute bottom-4 right-6 px-4 py-1 bg-white/90 text-zinc-700 text-xs font-semibold rounded-3xl shadow"
      >
        {{ isEdit ? 'Save' : 'Create' }}
      </button>
    </form>
  </template>
  
  <script setup lang='ts'>
  import { reactive, toRefs, watch, computed } from 'vue'
  
  // accept existing event data for edit mode
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        dateDay: '',
        dateMonth: '',
        title: '',
        location: '',
        description: '',
        going: 0,
        avatars: []
      })
    }
  })
  const emit = defineEmits(['update:modelValue', 'save', 'cancel'])
  
  // create a local reactive copy
  const form = reactive({ ...props.modelValue })
  const isEdit = computed(() => !!props.modelValue.id)
  
  // keep sync if parent changes the model
  watch(() => props.modelValue, val => Object.assign(form, val))
  
  function onSubmit() {
    // emit full event object, including id if editing
    emit('save', { ...form })
  }
  </script>
  