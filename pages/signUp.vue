<template>
    <form @submit.prevent="submitSignupForm" class="w-full flex flex-col items-center justify-center bg-white">
        <h2 class="text-3xl font-bold mt-5 text-center text-[#022150] w-full">Hello and Welcome!</h2>
        <div class="mt-6">
            <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <div class="flex space-x-6 mt-1 border-b border-gray-700">
                    <input type="text" id="first-name" class="px-3 py-2 rounded-md focus:outline-none"/>
                </div>
            </div>

            <div>
                <label class="block mt-4 text-sm font-medium text-gray-700">Last Name</label>
                <div class="flex space-x-6 mt-1 border-b border-gray-700">
                    <input type="text" id="last-name" class="px-3 py-2 rounded-md focus:outline-none"/>
                </div>
            </div>

            <div>
                <label class="block mt-4 text-sm font-medium text-gray-700">Email</label>
                <div class="flex space-x-6 mt-1 border-b border-gray-700">
                    <input type="text" id="email" class="px-3 py-2 rounded-md focus:outline-none"/>
                </div>
            </div>

            <div>
                <label class="block mt-4 text-sm font-medium text-gray-700">Phone Number</label>
                <div class="flex space-x-6 mt-1 border-b border-gray-700">
                    <input type="tel" class="px-3 py-2 rounded-md focus:outline-none"/>
                </div>
            </div>

            <div class="flex flex-col items-center mt-2 text-neutral-400">
                <p><b>Already have an account? <a href="./login" class="text-[#D9A2FF] no-underline hover:underline">Sign In</a></b></p>
            </div>
        </div>
        <br>
        <button type="submit" class="w-[280px] border-none text-white text-center cursor-pointer mt-3 py-4 rounded-xl bg-lavenderPurple hover:bg-purple-400">Register</button>

        <div v-if="errors?.error" class="error-message">
            <span><b>{{ errors.error }}</b></span>
        </div>
    </form>
</template>

<script setup>
import { useFetch } from '#app';

const router = useRouter();

const signupModel = ref({
    // userId: "sample",
    // firstname: "first name",
    // lastname: "Last name",
    // email: "test@email.com",
    // phoneNum: "+1 000 000 0000",
    // password: "pass",
    // confirmPassword: "pass"
});
const errors = ref({});

const submitSignupForm = async () => {
    errors.value={};
    try {
        const { data, error } = await useFetch('/api/user', {
            method: "POST",
            body: signupModel.value,
            watch: false
        });

        if(data?.value?.success){
            router.push("login");
        } else {
            errors.value={error:data?.value?.error};
        }

    } catch (err) {
        console.error("Error in submitting signup form", err); /* fixed typo */
    }
};
</script>
