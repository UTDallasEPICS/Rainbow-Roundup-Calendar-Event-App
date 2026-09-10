<script setup lang="ts">
    import { ref } from 'vue';
    const errorMessage = ref("");
    errorMessage.value = "";
    const message = ref("")
    const fname = ref("")
    const femail = ref("")

    const handleClick = async () => {
        try {
            await $fetch("/api/inquiryemail", {
                method: "POST",
                body: {
                    message: message.value,
                    fname: fname.value,
                    femail: femail.value
                }
            });
        } catch (error : any) {
            errorMessage.value = error.statusMessage || "Something went wrong.";
            console.log(errorMessage.value);
        }
    };

</script>

<template>
    <div class="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans p-6 md:p-12">
        <header
      class="max-w-6xl mx-auto bg-[#89BBEB]/80 rounded-3xl shadow-lg text-center px-8 py-14 mb-12 text-black"
        >
            <h1 class="text-3xl font-extrabold mb-6">Contact Us!</h1>
            <p class="max-w-md mx-auto text-md leading-relaxed font-medium">
                Want to become a Sponsor? Have a question about the group? Need more info? Have a media inquiry? Please give us a shout. We’ll make sure to get back to you as soon as we can!
            </p>
        </header>
        <div class="flex flex-col gap-4 max-w-6xl mx-auto">
            <div class="w-full mx-auto flex items-center gap-4 justify-center">
                <input v-model="fname" type="text" placeholder="Name" class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200" />
                <input v-model="femail" type="email" placeholder="Email" class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200" />
            </div>
            <div class="w-full mx-auto">
                <textarea v-model="message" type="text" placeholder="Message" class="h-32 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"></textarea>
            </div>
            <div class="flex justify-end">
                
                    <button @click="handleClick" class="px-3 py-2 bg-[#3A8DDE] hover:bg-[#2A6BAA] text-white rounded">Submit</button>
            </div>
        </div>
    </div>
</template>