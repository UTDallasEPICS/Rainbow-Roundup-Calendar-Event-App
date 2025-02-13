<template>

    <form @submit.prevent="submitSignupForm">
        <div class="flex flex-col items-center">
            <h2 class="sign">Sign Up</h2>

        </div>
        <div>
            <input class="textField" v-model="signupModel.firstname" id="firstname" placeholder="First Name" />
            <input class="textField" v-model="signupModel.lastname" id="lastname" placeholder="Last Name" />
            <input class="textField" v-model="signupModel.email" id="email" placeholder="Email" />
            <input class="textField" v-model="signupModel.phoneNum" id="phoneNum" placeholder="Phone Number" />
            <input type="passWord" class="textField" v-model="signupModel.password" id="password"
                placeholder="Password" />
            <input type="passWord" class="textField" v-model="signupModel.confirmPassword" id="confirmPassword"
                placeholder="Confirm Password" />
        </div>
        <div class="flex flex-col items-center">
            <br>
            <button type="submit" class="button bg-rose-400">Create Account</button>
        </div>
        <div v-if="errors?.error" class="error-message">
        <span><b>{{ errors.error }}</b></span>
    </div>
    </form>
    <div class="flex flex-col items-center">
        <br>
        <p><b><a href="./login">Already have an account? Sign In</a></b></p>
    </div>

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
})
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
        }else {
            errors.value={error:data?.value?.error};
        }

    } catch (error) {
        console.error("Error in submitting sihnup form", err);
    }
}
</script>

<style scoped>
.sign {
    font-size: 35px;
    margin-top: 40%;
}

.textField {
    margin-top: 10%;
    margin-left: 40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 25px;
    width: 355px;
    height: 20px;


}

#passWord {
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
    padding: 15px 120px;
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
