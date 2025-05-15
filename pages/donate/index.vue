<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { StripeElements, StripeElement } from "vue-stripe-js";
import type {
  StripeElementsOptionsMode,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";
import { useRuntimeConfig } from "#imports";

// Environment Variables for Stripe
const config = useRuntimeConfig();
const stripeKey = config.public.STRIPE_PUBLIC_KEY as string;

// Ensure Stripe public key exists
if (!stripeKey) {
  console.error("Stripe public key is missing or undefined.");
}

// Lifecycle hook: Runs before component is mounted to load Stripe and fetch payment intent
onBeforeMount(async () => {
  if (!stripeKey) {
    console.error("Stripe key is undefined. Cannot load Stripe.");
    return;
  }

  const stripeInstance = await loadStripe(stripeKey);
  if (stripeInstance) {
    stripeLoaded.value = true;
    await fetchPaymentIntent(donationAmount.value || 0);
  } else {
    console.error("Failed to load Stripe.");
  }
});

// Refs to manage state
const clicked = ref(false);
const showModal = ref(false);
const stripeLoaded = ref(false);
const clientSecret = ref<string>("");
const donationAmount = ref<number | null>(null);

// Stripe Options
const stripeOptions = ref({});
const elementsOptions = ref<StripeElementsOptionsMode>({
  mode: "payment",
  amount: 1099,
  currency: "usd",
  appearance: {
    theme: "flat",
  },
});
const paymentElementOptions = ref<StripePaymentElementOptions>({});

// Stripe Components
const elementsComponent = ref();
const paymentComponent = ref();

// Handle donation amount input
/**
 * Handles input change for donation amount, ensuring it's a valid positive number.
 * If the input is invalid (NaN or negative), it resets the donation amount to 0.
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = parseFloat(target.value);

  if (isNaN(value) || value < 0) {
    donationAmount.value = 0;
  } else {
    donationAmount.value = value;
  }
};

// Watch for donation amount changes and fetch new payment intent
/**
 * Watches for changes in the donation amount and triggers a new payment intent request
 * whenever the amount changes.
 */
watch(donationAmount, async (newAmount) => {
  if (newAmount !== null) {
    await fetchPaymentIntent(newAmount);
  }
});

// Fetch Payment Intent from Backend
/**
 * Makes a POST request to the backend to fetch a PaymentIntent for the provided donation amount.
 * Converts the donation amount to cents before sending the request.
 * If successful, the PaymentIntent clientSecret is stored.
 */
const fetchPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
    });

    const data = await response.json();
    if (data.success && data.data.clientSecret) {
      clientSecret.value = data.data.clientSecret;
    } else {
      console.error("Error fetching client secret:", data.error);
    }
  } catch (error) {
    console.error("Error making payment request:", error);
  }
};

// Handle Payment Submission
/**
 * Handles payment submission by confirming the payment with Stripe using the PaymentIntent's clientSecret.
 * Displays a modal and logs success or error messages based on the result.
 */
const handleSubmit = async () => {
  showModal.value = true;

  const stripeInstance = elementsComponent.value?.instance;
  const elements = elementsComponent.value?.elements;

  if (stripeInstance && clientSecret.value) {
    const { error } = await stripeInstance.confirmPayment({
      elements,
      clientSecret: clientSecret.value,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      console.error("Error confirming payment:", error);
    } else {
      console.log("Payment confirmed successfully.");
      showModal.value = true;
    }
  }
};
</script>

<template>
  <div class="p-6">
    <NuxtLink to="/">
      <ArrowLeftIcon class="h-5 w-5 text-black-500 my-2" />
    </NuxtLink>

    <div class="flex flex-col gap-2">
      <img
        src="/stockimage2.jpg"
        alt="Image of community"
        class="w-full h-[300px] object-cover rounded-xl"
      />
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl text-[#3D3745] font-bold">Rainbow Round Up</h1>
        <p class="text-md">
          Join us in our mission to promote diversity and location. We are
          committed to advancing LGBTQ+ rights and fostering a community of
          inclusivity and love. Your support can make a significant impact in
          creating a more equal and accepting society.
        </p>

        <div class="flex flex-col gap-2">
          <label for="donation" class="text-lg font-semibold text-[#3D3745]">
            Enter Donation Amount
          </label>
          <div class="relative w-full max-w-xs">
            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
              >$</span
            >
            <input
              id="donation"
              type="number"
              min="0"
              step="0.01"
              v-model="donationAmount"
              @input="handleInput"
              class="pl-6 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <form v-if="stripeLoaded" @submit.prevent="handleSubmit" class="block">
          <StripeElements
            :stripe-key="stripeKey"
            :instance-options="stripeOptions"
            :elements-options="elementsOptions"
            ref="elementsComponent"
          >
            <StripeElement
              type="payment"
              :options="paymentElementOptions"
              ref="paymentComponent"
              class="mb-4"
            />
          </StripeElements>
          <button
            :disabled="!stripeLoaded || !clientSecret"
            type="submit"
            class="bg-[#D9A2FF] text-white px-4 py-1.5 rounded-xl text-center whitespace-nowrap block w-full lg:min-w-[200px] lg:max-w-[300px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
          <NuxtLink to="/donate/accepted">
            <button class="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              Accept
            </button>
          </NuxtLink>
          <NuxtLink to="/donate/failed">
            <button class="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg">
              Failed
            </button>
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>
