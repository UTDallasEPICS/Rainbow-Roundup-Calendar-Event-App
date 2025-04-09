<script setup lang="ts">
import { ref, computed } from "vue";

// Set up page metadata for authentication
definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const { signIn, signOut, status } = useAuth();

// Reactive variables for form inputs
const email = ref("");
const password = ref("");
const errors = ref();

// Handle form submission for login
const handleSubmit = async () => {
  const credentials = { email: email.value, password: password.value };
  try {
    await signIn("credentials", credentials);
    alert("Login successful!");
  } catch (error) {
    alert("An error occurred");
  }
};

// Handle sign out
const handleSignOut = async () => {
  try {
    await signOut();
    alert("You have signed out.");
  } catch (error) {
    alert("An error occurred while signing out.");
  }
};
</script>

<template>
  <form v-if="status != 'authenticated'" @submit.prevent="handleSubmit">
    <h2 class="signIn-message text-3xl font-bold mt-5 text-center w-full">
      Sign In
    </h2>
    <div class="flex flex-col items-center py-5">
      <input
        type="email"
        class="username"
        v-model="email"
        id="email"
        placeholder="Email"
      />
      <input
        type="password"
        class="password"
        v-model="password"
        id="password"
        placeholder="Password"
      />
      <p class="forgot mt-2 text-neutral-400">
        <b><a href="./forgotPass">Forgot Password?</a></b>
      </p>
    </div>
    <div class="flex flex-col items-center">
      <button type="submit" class="button bg-rose-500 hover:bg-rose-700">
        Log In
      </button>
    </div>
    <div v-if="errors?.error" class="error-message">
      <span
        ><b>{{ errors.error }}</b></span
      >
    </div>
    <div class="flex flex-col items-center text-neutral-400">
      <p>
        <b
          >Don't have an account?
          <a href="./signUp" class="text-rose-700 no-underline hover:underline"
            >Sign Up</a
          >
        </b>
      </p>
    </div>
  </form>

  <div v-else>
    <p class="text-center">You are signed in.</p>
    <button @click="handleSignOut" class="button bg-rose-500 hover:bg-rose-700">
      Sign Out
    </button>
  </div>
</template>

<style scoped>
.signIn-message {
  font-size: 155%;
  margin-top: 5%;
  text-align: center;
}

.username {
  border-radius: 10px;
  border: 2px solid #000000;
  padding: 25px;
  width: 355px;
  height: 20px;
}

.password {
  margin-top: 2.5%;
  border-radius: 10px;
  border: 2px solid #000000;
  padding: 25px;
  width: 355px;
  height: 20px;
}

.button {
  border: none;
  color: white;
  padding: 15px 150px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 10px;
}

.error-message {
  color: red;
  text-align: center;
  /* Adjust the margin to control the downward shift */
}
</style>
