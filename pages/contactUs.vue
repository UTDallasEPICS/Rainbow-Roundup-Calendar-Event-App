<script setup lang="ts">
    const errorMessage = ref("");
    errorMessage.value = "";
    const message = ref("")
    const fname = ref("")
    const femail = ref("")

    const nameValid = computed(() => fname.value.trim() !== '')
    /* The regex used here makes it easier to work with the functions used to display invalid input indicators (the red things)
    HTML has built-in email validation for type="email" fields but not as clean with how this page is built
    Regex checks generally that the field looks like an email but doesn't verify that it actually is one. Email will still send to support either way, as the email field is for support to contact the user in the future
    Regex breakdown: ^ start of the string [^\s@]+ one or more characters that are not whitespace or @, @ is literally the @ symbol, [^\s@]+ again one or more characters that dont contain whitespace or @, \. is literally . and $ is the end of the string 
    
    This should be removed on Nathan's next PR
    
    */
    const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail.value))
    const messageValid = computed(() => message.value.trim() !== '')

    const nameTouched = ref(false)
    const emailTouched = ref(false)
    const messageTouched = ref(false)

    const nameFocused = ref(false)
    const emailFocused = ref(false)
    const messageFocused = ref(false)

    const isSubmitting = ref(false)
    const submitted = ref(false)
    const submissionError = ref(false)
    const invalidInfo = ref(false)

    const handleClick = async () => {
        nameTouched.value = true
        emailTouched.value = true
        messageTouched.value = true
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
        } catch (error : any) {
            errorMessage.value = error.statusMessage || "Something went wrong.";
            console.log(errorMessage.value);
            submissionError.value = true
        }
        isSubmitting.value = false
    };

</script>

<template>
    <div class="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans px-4 py-8 sm:px-6 sm:py-12 md:p-12">
        <header
            class="max-w-4xl mx-auto bg-[#89BBEB]/80 rounded-2xl sm:rounded-3xl shadow-lg text-center px-6 py-8 sm:px-8 sm:py-12 md:py-14 mb-8 sm:mb-12 text-black"
        >
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 md:mb-6">Contact Us!</h1>
            <p class="max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
                Want to become a Sponsor? Have a question about the group? Need more info? Have a media inquiry? Please give us a shout. We’ll make sure to get back to you as soon as we can!
            </p>
        </header>

        <form @submit.prevent="handleClick" novalidate class="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-0">
                <div class="flex flex-col">
                    <label for="contact-name" class="sr-only">Name</label>
                    <input
                        id="contact-name"
                        v-model="fname"
                        type="text"
                        placeholder="Name"
                        @focus="nameFocused = true"
                        @blur="nameTouched = true; nameFocused = false"
                        :class="[
                            'w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-sm sm:text-base',
                            nameTouched && !nameValid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                        ]"
                    />
                    <p class="mt-1 min-h-[1.25rem] text-sm text-red-500 px-2">
                        <span v-if="nameTouched && !nameValid">
                            Name is required.
                        </span>
                    </p>
                </div>

                <div class="flex flex-col">
                    <label for="contact-email" class="sr-only">Email</label>
                    <input
                        id="contact-email"
                        v-model="femail"
                        type="email"
                        placeholder="Email"
                        @focus="emailFocused = true"
                        @blur="emailTouched = true; emailFocused = false"
                        :class="[
                            'w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-sm sm:text-base',
                            emailTouched && !emailValid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                        ]"
                    />
                    <p class="mt-1 min-h-[1.25rem] text-sm text-red-500 px-2">
                        <span v-if="emailTouched && !emailValid">
                            Email invalid.
                        </span>
                    </p>
                </div>
            </div>

            <div class="flex flex-col">
                <label for="contact-message" class="sr-only">Message</label>
                <textarea
                    id="contact-message"
                    v-model="message"
                    placeholder="Message"
                    rows="4"
                    @focus="messageFocused = true"
                    @blur="messageTouched = true; messageFocused = false"
                    :class="[
                        'h-32 sm:h-36 md:h-40 w-full rounded-xl border bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-sm sm:text-base resize-y',
                        messageTouched && !messageValid ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                    ]"
                ></textarea>
                <p class="mt-1 min-h-[1.25rem] text-sm text-red-500 px-2 w-full">
                    <span v-if="messageTouched && !messageValid">
                        Message is required.
                    </span>
                </p>
            </div>

            <div class="flex flex-col items-stretch sm:items-end">
                <!-- Submit button. An API request is only sent when valid input is provided. -->
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    :class="[
                        'w-full sm:w-auto px-6 py-3 min-h-[44px] text-white font-medium rounded-xl shadow-sm transition duration-150 ease-in-out cursor-pointer flex items-center justify-center',
                        submissionError || invalidInfo
                            ? 'bg-[#E57373] hover:bg-[#D95C5C]'
                            : submitted
                            ? 'bg-[#4CAF50] hover:bg-[#3E8E41]'
                            : isSubmitting
                            ? 'bg-[#94A3B8] cursor-not-allowed'
                            : 'bg-[#3A8DDE] hover:bg-[#2A6BAA]'
                    ]"
                >
                    {{ submitted ? 'Submitted' : isSubmitting ? 'Sending...' : 'Submit' }}
                </button>
                <p class="mt-1 min-h-[1.25rem] text-xs sm:text-sm text-red-500 px-1 text-center sm:text-right">
                    <span v-if="submissionError || invalidInfo">
                        {{ invalidInfo ? 'Invalid input' : (errorMessage || 'Error') }}
                    </span>
                </p>
            </div>
        </form>
    </div>
</template>
