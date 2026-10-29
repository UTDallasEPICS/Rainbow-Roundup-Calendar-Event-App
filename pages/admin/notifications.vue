<script setup lang="ts">
    import { ref } from  'vue';
    import type { User, Event } from '~/types/event';
    const message = ref("")
    const subject = ref("")
    const messageTouched = ref(false)
    const messageFocused = ref(false)
    const messageValid = computed(() => message.value.trim() !== '')
    const eventData = await useFetch<Event[]>('/api/event', { method: "GET"})
    const events = ref<Event[]>([]);
    events.value = eventData.data.value ?? []
    const selectedEvent = ref<Event | null>(null);

    const errorMessage = ref("");
    errorMessage.value = "";

    const isSubmitting = ref(false)
    const submitted = ref(false)
    const submissionError = ref(false)
    const invalidInfo = ref(false)

    const handleClick = async() => {
        invalidInfo.value = false
        submitted.value = false
        submissionError.value = false

        if (!messageValid.value) {
            invalidInfo.value = true
             
            return
        }
        isSubmitting.value = true
        try {
            if (selectedEvent.value) {
                await sendSignUpsEmail(selectedEvent.value)
            }
            else {
                await sendAllEmail()
            }
            submitted.value = true
        } catch (error : any) {
            errorMessage.value = error.statusMessage || "Something went wrong.";
            submissionError.value = true
        }
        
        isSubmitting.value = false
    };

    function selectUsers() {
        selectedEvent.value = null
    }

    function selectEvent(event : Event) {
        selectedEvent.value = event
    }

    async function sendSignUpsEmail(event : Event) {
        const users = await $fetch<{Event: { Users: User[] }}>(`/api/event/${event.id}/signedupusers`, {method: "GET"});
        await $fetch("/api/manualnotification", {method: "POST", body : {subject: subject.value, message: message.value, users: users.Event.Users}});
    }

    async function sendAllEmail() {
        const users = await $fetch<{ Users: User[] }>(`/api/user`, {method: "GET"});
        await $fetch("/api/manualnotification", {method: "POST", body : {subject: subject.value, message: message.value, users: users.Users}});
    }

</script>

<template>
    <div class="bg-gray-100 flex flex-col items-center justify-between p-8 w-full">
        <div class="w-full px-6 py-4 flex flex-col items-start justify-between">
            <h3 class="font-bold text-xl">Choose a group to send a notification to</h3>
            <div class="flex flex-col w-full">
                <EventFocusList :events="events" :manual-entries="[{ id : 'all-users', title: 'All Users'}]" @select-all-users="selectUsers" @event-focused="selectEvent"/>
            </div>
        </div>

        <div class="w-full px-6 py-4 flex flex-col items-start justify-between gap-4">
            <div class="w-full flex items-center flex-col gap-4">
                <input v-model="subject" type="text" placeholder="Subject" class="w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"/> <!-- Subject line. Recommended, but not required.-->
                <textarea v-model="message" type="text" placeholder="Message" @focus="messageFocused = true" @blur="messageTouched = true; messageFocused = false" :class="['h-32 w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200', messageTouched && !messageValid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300']"></textarea>
            </div>
            <div class="flex justify-between w-full">
                <p class="mt-1 h-5 text-sm text-red-500 px-4 w-full">
                    <span v-if="messageTouched && !messageValid">
                        Message is required.
                    </span>
                </p>
                <div class="flex justify-end w-full">
                        <!-- Submit button. An API request is only sent when valid input is provided. -->
                         <div class="flex-col">
                            <button @click="handleClick" :disabled="isSubmitting" :class="['px-3 py-2 text-white rounded', submissionError || invalidInfo ? 'bg-[#E57373] hover:bg-[#D95C5C]' : submitted ? 'bg-[#4CAF50] hover:bg-[#3E8E41]' : isSubmitting ? 'bg-[#94A3B8] cursor-not-allowed' : 'bg-[#3A8DDE] hover:bg-[#2A6BAA]']">{{ submitted ? 'Submitted' : isSubmitting ? 'Sending...' : 'Submit' }}</button>
                            <p class="mt-1 h-5 text-xs text-red-500 px-1">
                                <span v-if="submissionError || invalidInfo">
                                    {{invalidInfo ? 'Invalid input': 'Error'}}
                                </span>
                            </p>
                        </div>
                </div>
            </div>
            
        </div>
        <div></div>
    </div>
</template>