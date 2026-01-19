<template>


<!-- window -->
    <div
    class="z-40 fixed top-0 right-0 min-h-screen flex w-full items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto"
    >
        <!-- background -->
        <div
            class="fixed top-0 right-0 z-30 h-full w-full bg-black/70 backdrop-blur-sm" @click="closeWindow()"
        />
    
        <div
        class="z-50 w-full max-w-xl bg-white rounded-2xl shadow-md relative overflow-auto max-h-[70vh]"
        >
            <div class="absolute top-4 right-4 flex space-x-2 z-10">
                    <button @click="closeWindow()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                        </svg>
                    </button>
            </div>


            <div class="p-6 space-y-6">
                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">Select an upcoming event</h2>
                    <div v-if="isLoading" class="px-4 py-3 text-gray-400">
                        Loading...
                    </div>
                    <div v-else-if="events.length > 0" class="flex flex-wrap flex-row w-full">
                        <div v-for="event in events" class="rounded shadow-md p-2 m-2" 
                        :class="{ 
                            'border-2': (event.id == selectedEventId), 
                            'border-[#C028B9]': (event.id == selectedEventId),
                            'bg-[#C028B9]': (event.id == selectedEventId),
                            'text-white': (event.id == selectedEventId)}
                            "
                        @click="selectEvent(event.id)">
                            {{ event.title }}
                        
                        </div>
                    </div>
                    <div v-else class="px-4 py-3 text-gray-400">
                        No upcoming events.
                    </div>
                </div>
                

                <div>
                    <h2 class="w-full text-lg font-semibold text-gray-800">or enter an event ID</h2>
                </div>

                <!-- manage buttons -->
                 <div class="w-full flex justify-center gap-4">
                    <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 cursor-pointer transition" @click="confirmSelection()">
                        Confirm
                    </button>
                    <button class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="closeWindow()">
                        Cancel
                    </button>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(['selectEvent', 'closeWindow'])

const selectedEventId = ref("")
const enteredEvent = ref("")
const events = ref([])
const isLoading = ref(true)

// fetching events
try {
    const response = await useFetch(`/api/event`, {
        query: { method: "GET" }
    })

    console.log(response)
    events.value = response.data.value

}
catch (error) {
    console.error("Could not fetch events: ", error)
}
finally {
    isLoading.value = false
}

function confirmSelection() {

    if (enteredEvent.value != null && enteredEvent.value != "")
    {
        selectedEventId.value = enteredEvent.value;
    }
    
    // check if event exists
    try {
        const response = $fetch(`/api/event/${selectedEventId.value}`, {
            method: "GET"
        })

        console.log(response)

        emit('selectEvent', selectedEventId)
        closeWindow()
    }
    catch (error) {
        console.error("Error selecting event:", error);
        alert("Error selecting event. Please try again.");
    }

    
}

function closeWindow() {
    emit('closeWindow')
}

function selectEvent(id) {
    selectedEventId.value = id
}

function formatDateTime(d) {
    date = new Date(d)

    return 
}

</script>
