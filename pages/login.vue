<script setup lang="ts">
import { ref } from "vue";



import { authClient } from "~/server/auth"
const { data: session } = await authClient.getSession();
if(session){
  navigateTo("/");
}
const responseMessage = ref('');
const email = ref("");
const otp = ref("");
const formMode = ref("email");
const redirectPath = ref("");
const submitEmail = async () => {
  if (!email.value) return;
  formMode.value = "loading";
  const { data, error } = await authClient.emailOtp.sendVerificationOtp({
    email: email.value, // required
    type: "sign-in", // required
    
  });
  if(error){
    if(error.message){
      responseMessage.value = error.message;
    }
    else{
      responseMessage.value = error.statusText;
    }
    console.log(error);
    formMode.value = "done";
  }
  else if(data?.success){
    formMode.value = "otp";
  }
  else{
    formMode.value = "done";
  }
};
const submitOTP = async () => {
  // Note: if the user has not verified their email, but successfully logs in, it autoverifies the email since you just used it to login
  if (!email.value) return; 
  const { data, error } = await authClient.signIn.emailOtp({
    email: email.value, // required
    otp: otp.value, // required
  });
  if (error) {
    responseMessage.value = "Verification failed";
    redirectPath.value = "/login";
  }
  else{
    responseMessage.value = "Successfully logged in!";
    redirectPath.value = "/";
    window.location.href = '/'
  }
  formMode.value = "done";
};
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-white px-6 py-12">
    <h2 class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8"
    v-if="formMode ==='loading'">
      Loading, please wait...
    </h2>
    <form @submit.prevent="submitEmail" class="w-full max-w-xl rounded-2xl p-8 sm:p-10 flex flex-col items-center"
      v-if="formMode === 'email'">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8">
        Welcome Back
      </h2>

      <!-- Email Field -->
      <div class="w-full">
        <label class="block text-lg font-semibold text-gray-800 mb-2">Email</label>
        <input v-model="email" type="email" placeholder="you@example.com"
          class="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
      </div>

      <!-- Send Magic Link Button -->
      <button type="submit"
        class="mt-8 w-full sm:w-[280px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl">
        Send Login Code
      </button>

      <!-- Optional error message -->
      <!--
      <div v-if="errors?.error" class="mt-4 text-red-600 text-lg font-semibold">
        {{ errors.error }}
      </div>
      -->

      <!-- Sign Up Link -->
      <div class="text-lg mt-6 text-center text-gray-600">
        <strong>
          Don't have an account?
          <a href="./signUp" class="text-[#D97ED5] hover:underline transition">Sign Up</a>
        </strong>
      </div>
    </form>
    <form @submit.prevent="submitOTP" class="w-full max-w-xl rounded-2xl p-8 sm:p-10 flex flex-col items-center"
      v-if="formMode === 'otp'">
      <!-- OTP Field -->
      <div class="w-full">
        <label class="block text-lg font-semibold text-gray-800 mb-2">OTP Code</label>
        <input v-model="otp" type="otp" placeholder="123456"
          class="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89BBEB] transition" />
        <!-- Send Magic Link Button -->
        <button type="submit"
          class="mt-8 w-full sm:w-[280px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl">
          Check otp
        </button>
       
      </div>
       
       
    </form>
    <h2 class="text-2xl sm:text-3xl font-extrabold text-center text-[#022150] mb-8" v-if="formMode==='done'">
        {{ responseMessage }}
        <div>
        <button onclick="window.location.href = '/';"
          class="mt-8 w-full sm:w-[280px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl"
          v-if="responseMessage==='Successfully logged in!'">
          <text >Go to home page</text>
        </button>
        <button  onclick="window.location.href = '/login';" 
          class="mt-8 w-full sm:w-[280px] py-4 px-6 text-xl text-white font-semibold bg-[#D97ED5] hover:bg-purple-500 transition rounded-2xl"
          v-if="responseMessage==='Verification failed'">
          
          <text >Try Again</text>
        </button>
        </div>
      </h2>
  </div>
</template>
