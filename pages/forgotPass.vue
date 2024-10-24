<template>
    <div>
        <h2 class="message">We'll send your password reset info  to <br>the email address linked to your <br>account</h2>
        <br><br><br>
        <input type="emailAddress" id="emailAddress" placeholder = "email address"/>
        <br><br>
        <button class="button button1">Recover Password</button>
        <p class="go-back"><a href="./login">back</a></p>
        
    </div>
</template>

<script setup>

</script>

<style scoped>
    .button {
  border: none;
  color: white;
  padding: 14px 112px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 39px;
  cursor: pointer;
  border-radius: 10px;
    }
    .button1 {
        background-color: #70D6FF;} 
.message{
    margin-top: 50%;
    margin-right:18%;
    margin-left:18%;
    text-align: center;
}
#emailAddress
        {
        margin-left:40px;
        border-radius: 10px;
        border: 2px solid #000000;
        padding: 25px; 
        width: 355px;
        height: 20px;  
        }
.go-back{
    margin-top: 5%;
    margin-left:10%;
   
}
</style>