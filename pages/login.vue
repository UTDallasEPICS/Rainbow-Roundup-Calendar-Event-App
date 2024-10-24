<template>
    <div>
        <h2 class="signIn-message">Sign In</h2>
        <input type="userName" id="userName" placeholder = "User Name"/>
        <input type="passWord" id="passWord" placeholder = "Password"/>
        <p class="forgot"><b><a href="./forgotPass">Forgot Password ?</a></b></p>
       
    </div>
    <div class="flex flex-col items-center">
        <button class="button button1"><a href="./profile">Log In</a></button>
    </div>
    <div class= "flex flex-col items-center">
        <br>
        <p><b><a href="./signUp">Don't have an account? Sign Up</a></b></p>
    </div>

</template>
<script setup>

</script>

<style scoped>
    .signIn-message{
        font-size: 155%;
        margin-top: 60%;
        text-align: left;
        margin-left: 10%;
    }
    .forgot{
        margin-left:60%
    }
     #userName
    {
    margin-top: 15%;
    margin-left:40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 25px; 
    width: 355px;
    height: 20px;  
    

    }
    #passWord
    {
    margin-top: 2.5%;
    margin-left:40px;
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
        background-color: #70D6FF;} 

</style>
