<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-between p-8 w-full">
        <div class="w-full px-6 py-4 flex flex-col items-center justify-between">
            <!-- header -->
            <div class="w-full max-w-4xl flex items-center justify-between">
                <NuxtLink to="/admin" class="self-center flex flex-row">
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
                </svg> 
                <h1 class="text-xl font-bold text-slate-900">Manage Events</h1>
                </NuxtLink>

                <!-- Page Title -->

                <!-- Search & Filter -->
                <div class="flex space-x-4">
                    <!-- Search Icon -->
                    <!-- Search Input -->
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search events..."
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 float: right"
                    />

                    <!-- Filter Icon -->
                    <button aria-label="Filter">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-zinc-700 hover:text-zinc-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="w-full max-w-4xl flex justify-center py-10">
                <div class="text-gray-600 text-lg animate-pulse">Loading events...</div>
            </div>
            <!-- Scrollable events list -->
            <div v-else class="w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6">
                <EventList :events="filteredEvents" />
              <h2 class="text-2xl font-bold text-zinc-700 col-span-1 mt-7">Archived Events</h2>
                <EventList :events="archivedEvents" />
              
            </div>
            <div>
                
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

//import { fetchCombinedEvents } from "../server/utils/fetchCombinedEvents";
import { ref, computed } from "vue"

const events = ref([])
const loading = ref(true)
const searchQuery = ref("")
const archivedEvents = ref([])

const filteredEvents = computed(() => {
    if (!searchQuery.value.trim()) return events.value;
      return events.value.filter((event) =>
        event.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
})

try {
    // need to change to non combined
    // const data = await fetchCombinedEvents();
    // events.value = data;
    
    // thing causing issues right now down below
    const { data: response} = await useFetch(`/api/archive/event`)
    console.log(response.value)
    //archivedEvents.value = response

    

    }
    catch (error) {
        console.error("Could not fetch events: ", error)
    }
    finally
    {
        loading.value = false;
    }


</script>