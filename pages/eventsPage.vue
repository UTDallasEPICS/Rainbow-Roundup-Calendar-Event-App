<template>
  <div class="min-h-screen bg-gray-100 w-full flex flex-col items-center">
    <!-- Amber nav bar -->
    <div class="w-full bg-amber-100">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Back to Admin -->
        <NuxtLink
          to="/admin"
          class="inline-flex items-center text-zinc-700 hover:text-zinc-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Events</h1>
        </NuxtLink>

        <!-- Page Title -->


        <!-- Search & Filter -->
        <div class="flex space-x-4">
          <!-- Search Icon -->
          <button aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          <!-- Filter Icon -->
          <button aria-label="Filter">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-700 hover:text-zinc-900" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable events list -->
    <div class="w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6">
      <EventList :events="events" />
    </div>
  </div>
</template>

<script>
import EventList from '~/components/EventList.vue'

export default {
  name: 'EventsPage',
  components: { EventList },
  data() {
    return {
      events: [
        {
          id: 1,
          title: 'April Social Hangout',
          date: '2025-04-28',
          time: '5:30 PM',
          location: 'Location Space, City',
          isActive: true
        },
        {
          id: 2,
          title: 'Musical Event at the Museum',
          date: '2025-05-01',
          time: '2:00 PM',
          location: 'Another Location, Dallas',
          isActive: false
        },
        {
          id: 3,
          title: 'Parents Night Out',
          date: '2025-04-23',
          time: '6:00 PM',
          location: 'Place 3, Richardson',
          isActive: true
        },
        {
          id: 4,
          title: 'Mother’s Day Brunch',
          date: '2025-04-28',
          time: '5:30 PM',
          location: 'Yeehaw, Plano',
          isActive: true
        }
      ]
    }
  }
}
</script>
