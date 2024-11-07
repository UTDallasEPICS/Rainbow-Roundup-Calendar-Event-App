<template>
    <div class="flex flex-col items-center">
        <h2 class = "sign">Sign Up</h2>
       
    </div>
    <div>
        <input type="userName" id="userName" placeholder = "User Name"/>
        <input type="userName" id="passWord" placeholder = "Name"/>
        <input type="userName" id="passWord" placeholder = "Email"/>
        <input type="userName" id="passWord" placeholder = "Phone Number"/>
        <input type="passWord" id="passWord" placeholder = "Password"/>
        <input type="passWord" id="passWord" placeholder = "Confirm Password"/>
    </div>
    <div class="flex flex-col items-center">
        <br>
        <button class="button button1"><a href="./profile">Create Account</a></button>
    </div>
    <div class= "flex flex-col items-center">
        <br>
        <p><b><a href="./login">Already have an account? Sign In</a></b></p>
    </div>

</template>
<script setup>

</script>

<style scoped>
    .sign{
        font-size: 35px;
        margin-top: 40%;
    }
     #userName
    {
    margin-top: 10%;
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
  padding: 15px 120px;
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
