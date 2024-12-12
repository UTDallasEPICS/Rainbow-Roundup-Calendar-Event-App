<template>
    <!--
    <div>

        <div v-if="data?.value?.success">
            Login Sucessful
        </div>
        <div v-else>
            <div>
                <p>{{ data.value.error }}</p>
            </div>
        </div>
    </div>
    -->
    <form @submit.prevent="submitLoginForm">
        <div>
            <h2 class="signIn-message">Sign In</h2>
            <input type="email" class="username" v-model="loginModel.email" id="email" placeholder="Email Id" />
            <input type="passWord" class="password" v-model="loginModel.password" id="passWord"
                placeholder="Password" />
            <p class="forgot"><b><a href="./forgotPass">Forgot Password ?</a></b></p>

        </div>
        <div class="flex flex-col items-center">
            <button type="submit" class="button button1">Log In</button>
        </div>
        <div class="flex flex-col items-center">
            <br>
            <p><b><a href="./signUp">Don't have an account? Sign Up</a></b></p>
        </div>
    </form>
</template>
<script setup>
import { useFetch } from '#app';
const loginModel = ref({
    email: "test@email.com",
    password: "pass",
});
const submitLoginForm = async () => {
    try {
        const { data, error } = await useFetch('/api/login', {
            method: "POST",
            body: loginModel.value,
            watch: false
        });

        console.log("data...", JSON.stringify(data.value));
        if (error) {
            console.error(error);
            // errorMessage=error.value;
        } else {
            console.log("Form submitted sucessfully ", data.value);
        }
    } catch (error) {
        console.error("Error in submitting Login form", err);
    }
}
</script>

<style scoped>
.signIn-message {
    font-size: 155%;
    margin-top: 60%;
    text-align: left;
    margin-left: 10%;
}

.forgot {
    margin-left: 60%
}

.username {
    margin-top: 15%;
    margin-left: 40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 25px;
    width: 355px;
    height: 20px;


}

.passWord {
    margin-top: 2.5%;
    margin-left: 40px;
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

.button1 {
    background-color: #70D6FF;
}
</style>
