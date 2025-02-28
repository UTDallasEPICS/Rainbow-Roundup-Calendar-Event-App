<template>
    <form @submit.prevent="submitLoginForm">
            <h2 class="signIn-message text-3xl font-bold mt-5 text-center w-full">Sign In</h2>
            <div class="flex flex-col items-center py-5">
                <input type="email" class="username" v-model="loginModel.email" id="email" placeholder="Email" />
                <input type="passWord" class="password" v-model="loginModel.password" id="passWord"
                    placeholder="Password" />
                <p class="forgot mt-2 text-neutral-400"><b><a href="./forgotPass">Forgot Password?</a></b></p>

            </div>
        <div class="flex flex-col items-center">
            <button type="submit" class="button bg-rose-500 hover:bg-rose-700">Log In</button>
        </div>
        <div v-if="errors?.error" class="error-message">
            <span><b>{{ errors.error }}</b></span>
        </div>
        <div class="flex flex-col items-center text-neutral-400">
            <p><b>Don't have an account? <a href="./signUp" class="text-rose-700 no-underline hover:underline">Sign Up</a></b></p>
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
