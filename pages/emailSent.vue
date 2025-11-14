<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Verify Your Email
      </h2>

      <!-- Global Success / Error Banners -->
      <transition name="fade">
        <div
          v-if="successMessage"
          class="p-4 rounded-md bg-green-100 text-green-700 flex items-center justify-between"
        >
          <span>{{ successMessage }}</span>
          <button @click="successMessage = ''" class="text-xl font-bold">&times;</button>
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="errorMessage"
          class="p-4 rounded-md bg-red-100 text-red-700 flex items-center justify-between"
        >
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="text-xl font-bold">&times;</button>
        </div>
      </transition>

      <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
        <!-- Email Input -->
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            autocomplete="email"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <!-- OTP Input -->
        <div>
          <label for="otp" class="sr-only">OTP</label>
          <input
            id="otp"
            type="text"
            v-model="form.otp"
            required
            maxlength="6"
            pattern="[0-9]{6}"
            autocomplete="one-time-code"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="6‑digit code"
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Verifying…
            </span>
            <span v-else>Verify Email</span>
          </button>
        </div>

        <!-- Resend OTP Button -->
        <div class="flex justify-center">
          <button
            type="button"
            @click="onResend"
            :disabled="resendLoading || !form.email"
            class="group relative flex items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="resendLoading" class="flex items-center">
              <svg
                class="animate-spin h-5 w-5 mr-2 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Resending…
            </span>
            <span v-else>Resend OTP</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authClient } from '~/server/auth' // Adjust if you expose it via a client‑side plugin

const form = reactive({
  email: '',
  otp: '',
})

const loading = ref(false)
const resendLoading = ref(false)

const successMessage = ref('')
const errorMessage = ref('')
const resendErrorMessage = ref('')
const resendSuccessMessage = ref('')

// Verify email
async function onSubmit() {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const { data, error } = await authClient.emailOtp.verifyEmail({
      email: form.email,
      otp: form.otp,
    })

    if (error) {
      throw new Error(error.message ?? 'Verification failed')
    }

    successMessage.value = '✅ Your email has been verified!'
    // Optional: redirect or update global auth state
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}

// Resend OTP
async function onResend() {
  if (!form.email) {
    resendErrorMessage.value = 'Please enter your email first.'
    return
  }

  resendLoading.value = true
  resendErrorMessage.value = ''
  resendSuccessMessage.value = ''

  try {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: form.email,
      type: 'email-verification',
    })

    if (error) {
      throw new Error(error.message ?? 'Could not resend OTP')
    }

    resendSuccessMessage.value = '✅ A new code has been sent to your email.'
  } catch (err: any) {
    console.error(err)
    resendErrorMessage.value = err.message || 'Failed to resend OTP.'
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>