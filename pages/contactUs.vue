<script setup lang="ts">
    import { ref } from 'vue';
    const errorMessage = ref("");
    errorMessage.value = "";
    const message = ref("")
    const fname = ref("")
    const femail = ref("")

    const nameValid = computed(() => fname.value.trim() !== '')
    const emailValid = computed(() => {
        if (typeof document === 'undefined') return false;
        const input = document.createElement('input');
        input.type = 'email';
        input.required = true;
        input.value = femail.value;
        return input.checkValidity();
    })
    const messageValid = computed(() => message.value.trim() !== '')

    const nameTouched = ref(false)
    const messageTouched = ref(false)

    const nameFocused = ref(false)
    const messageFocused = ref(false)

    const isSubmitting = ref(false)
    const submitted = ref(false)
    const submissionError = ref(false)
    const invalidInfo = ref(false)

    const handleClick = async () => {
        invalidInfo.value = false
        submitted.value = false
        submissionError.value = false
        if (!nameValid.value || !emailValid.value || !messageValid.value) {
            console.log("returned")
            invalidInfo.value = true
            return
        }
        isSubmitting.value = true
        try {
            await $fetch("/api/inquiryemail", {
                method: "POST",
                body: {
                    message: message.value,
                    fname: fname.value,
                    femail: femail.value
                }
            });
            submitted.value = true;
        } catch (error) {
            errorMessage.value = error.statusMessage || "Something went wrong.";
            console.log(errorMessage.value);
            submissionError.value = true
        }
        isSubmitting.value = false
    };

</script>

<template>
    <div class="min-h-screen">
       
        
        <div class="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans p-6 md:p-12">
            <header
        class="max-w-6xl mx-auto bg-[#89BBEB]/80 rounded-3xl shadow-lg text-center px-8 py-14 mb-12 text-black"
            >
                <h1 class="text-3xl font-extrabold mb-6">Contact Us!</h1>
                <p class="max-w-md mx-auto text-md leading-relaxed font-medium">
                    Want to become a Sponsor? Have a question about the group? Need more info? Have a media inquiry? Please give us a shout. We’ll make sure to get back to you as soon as we can!
                </p>
            </header>
            <div class="flex flex-col gap-1 max-w-6xl mx-auto">
                <div>
                    <div class="w-full mx-auto flex items-start gap-4 justify-center">
                        <div class="flex-1 flex flex-col">
                            <input v-model="fname" type="text" placeholder="Name" @focus="nameFocused = true" @blur="nameTouched = true; nameFocused = false" :class="['w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200', nameTouched && !nameValid ?  'border-red-500 ring-2 ring-red-200' : 'border-gray-300']" />
                            <p class="mt-1 h-5 text-sm text-red-500 px-4">
                                <span v-if="nameTouched && !nameValid" class="">
                                    Name is required.
                                </span>
                            </p>
                        </div>
                        <div class="flex-1 flex flex-col">
                            <input 
                                v-model="femail" 
                                type="email" 
                                required
                                placeholder="Email" 
                                class="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 [&:user-invalid]:border-red-500 [&:user-invalid]:ring-2 [&:user-invalid]:ring-red-200" 
                            />
                            <p class="mt-1 h-5 text-sm text-red-500 px-4 invisible peer-[:user-invalid]:visible">
                                Email invalid.
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="w-full mx-auto">
                        <textarea v-model="message" type="text" placeholder="Message" @focus="messageFocused = true" @blur="messageTouched = true; messageFocused = false" :class="['h-32 w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200', messageTouched && !messageValid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300']"></textarea>
                    </div>
                    <p class="mt-1 h-5 text-sm text-red-500 px-4 w-full">
                        <span v-if="messageTouched && !messageValid" class="">
                            Message is required.
                        </span>
                    </p>
                </div>
                <div class="flex justify-end">
                    <div class="flex-col">
                        <!-- Submit button. An API request is only sent when valid input is provided. -->
                        <button @click="handleClick" :disabled="isSubmitting" :class="['px-3 py-2 text-white rounded', submissionError || invalidInfo ? 'bg-[#E57373] hover:bg-[#D95C5C]' : submitted ? 'bg-[#4CAF50] hover:bg-[#3E8E41]' : isSubmitting ? 'bg-[#94A3B8] cursor-not-allowed' : 'bg-[#3A8DDE] hover:bg-[#2A6BAA]']">{{ submitted ? 'Submitted' : isSubmitting ? 'Sending...' : 'Submit' }}</button>
                        <p class="mt-1 h-5 text-xs text-red-500 px-1">
                            <span v-if="submissionError || invalidInfo" class="">
                                {{invalidInfo ? 'Invalid input': 'Error'}}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

