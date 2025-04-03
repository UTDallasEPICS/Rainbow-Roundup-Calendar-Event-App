<template>
    <form @submit.prevent="submitLoginForm" class="mt-20 w-full flex flex-col items-center justify-center bg-white">
      <h2 class="text-3xl font-bold mt-5 text-center text-[#022150] w-full">Welcome Back</h2>
        <div class = "mt-6">
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <div class="flex space-x-6 mt-1 border-b border-gray-700">
                    <input type="email" class="username px-3 py-2 rounded-md focus:outline-none" v-model="loginModel.email" id="email"/>
                </div>
            </div>

        <br>
        <button type="submit" class="w-[264px] border-none text-white text-center cursor-pointer mt-3 py-4 rounded-xl bg-lavenderPurple hover:bg-purple-400">Login</button>

        <div v-if="errors?.error" class="error-message">
            <span><b>{{ errors.error }}</b></span>
        </div>
        <div class="flex flex-col items-center mt-2 text-neutral-400">
            <p><b>Don't have an account? <a href="./signUp" class="text-[#D9A2FF] no-underline hover:underline">Sign Up</a></b></p>
        </div>
        </div>
    </form>
</template>
<script setup>
import { useFetch } from "#app";

const loginModel = ref({
  // email: "test@email.com",
  // password: "pass",
});
const errors = ref({});
const submitLoginForm = async () => {
  errors.value = {}; // reset errors
  try {
    const { data, error } = await useFetch("/api/login", {
      method: "POST",
      body: loginModel.value,
      watch: false,
    });
    const value = data.value;
    console.log(error);
    console.log(value);

    if (!value.success) {
      errors.value = { error: value.error };
    }

    if (error) {
      console.error(error);
       // errorMessage=error.value;
    } else {
      console.log("Form submitted sucessfully ", data.value);
    }
    } catch (error) {
        console.error("Error in submitting login form", error);
    }
  };
</script>