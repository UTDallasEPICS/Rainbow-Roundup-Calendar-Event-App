<template>

    <form @submit.prevent="submitSignupForm" class="flex flex-col items-center w-full">
            <h2 class="sign">Sign up</h2>

            <div class="flex flex-col items-center py-5"> 
                <input class="textField" v-model="signupModel.firstname" id="firstname" placeholder="First Name" />
                <input class="textField" v-model="signupModel.lastname" id="lastname" placeholder="Last Name" />
                <input class="textField" v-model="signupModel.email" id="email" placeholder="Email" />
                <input class="textField" v-model="signupModel.phoneNum" id="phoneNum" placeholder="Phone Number" />
                <input type="passWord" class="textField" v-model="signupModel.password" id="password"
                    placeholder="Password" />
                <input type="passWord" class="textField" v-model="signupModel.confirmPassword" id="confirmPassword"
                    placeholder="Confirm Password" />
            </div>

            <div class="flex flex-col items-center mt-2">
                <p><b><a href="./login">Already have an account? Sign in</a></b></p>
            </div>

            <br>
<<<<<<< Updated upstream
            <button type="submit" class="button bg-rose-400">Create Account</button>
        </div>
        <div v-if="errors?.error" class="error-message">
        <span><b>{{ errors.error }}</b></span>
    </div>
=======
            <button type="submit" class="button w-full bg-rose-500 hover:bg-rose-700">Create Account</button>

            <div v-if="errors?.error" class="error-message">
                <span><b>{{ errors.error }}</b></span>
             </div>
>>>>>>> Stashed changes
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
        console.error("Error in submitting signup form", err); /* fixed typo */
    }
}
</script>

<style scoped>
.sign {
    font-size: 35px;
    margin-top: 5%; /* fixed awkward space issue*/
    text-align: center;
    width: 100%;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.textField {
    margin-top: 5%;
    border-radius: 10px;
    border: 2px solid #969696;
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
    width: 355px;
    border: none;
    color: white;
    padding: 15px 0;
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
    border-radius: 10px;
}

<<<<<<< Updated upstream
=======
.button1 {
    background-color: #ff5e5e; /* changed button color*/
}
>>>>>>> Stashed changes
.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
    /* Adjust the margin to control the downward shift */

}
</style>
