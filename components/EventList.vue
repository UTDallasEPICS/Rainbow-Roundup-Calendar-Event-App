<template>
    <div class="space-y-6">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white rounded-2xl shadow flex items-center p-4"
      >
        <!-- left color block -->
        <div class="w-20 h-24 bg-amber-300 rounded-[10px] flex-shrink-0 mr-4"></div>
  
        <!-- event info -->
        <div class="flex-1">
          <div class="text-xs text-indigo-500 font-normal">
            {{ formatDate(event.date) }} • {{ event.time }}
          </div>
          <div class="text-base text-slate-900 font-medium">
            {{ event.title }}
          </div>
          <div class="text-xs text-gray-500 font-normal">
            {{ event.location }}
          </div>
        </div>
  
        <!-- status badge -->
        <div class="w-7 h-7 bg-orange-100 rounded-md backdrop-blur-[3px] flex items-center justify-center">
          <div
            class="w-3 h-3 rounded-full"
            :class="event.isActive ? 'bg-red-400' : 'bg-gray-400'"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventList',
    props: {
      events: {
        type: Array,
        required: true
      }
    },
    methods: {
      formatDate(iso) {
        const opts = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(iso).toLocaleDateString('en-US', opts);
      }
    }
  }
  </script>
  