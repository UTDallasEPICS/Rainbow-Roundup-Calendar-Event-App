

<template>
<div class="flex flex-row items-center">
    <h1 class="profile "><b>Profile Page</b></h1>
    <p class= "edit "><a href="./edit">Edit</a></p>
</div>
<div class= "flex flex-col items-center">
     <img class="prof-icon" src="../public/images/ProfileImage.png" alt="Profile Page ">
     <p class="text">NAME OF PERSON</p>
     <p class="text">email@gmail.com | +1 232-323-2323</p>
     <br>

     
</div>
<div>   
    <br>  
    <br>
    <input type="text" id="about" placeholder = "About"/>
    
     <br><br><br>
     <input type="text" id="tag"placeholder = "Tag"/>
     <br><br>
     <br><br>
     <input type="text" id="waiver"placeholder = "Upload Waiver"/>
</div>
<div class="flex flex-col items-center">
    <br>
<button class="button button1"><a href="./login">Log Out</a></button>
</div>
    
</template>

<script setup>

</script>

<style scoped>
    .flex{
        margin-top: 20px;
    }
    .text{
        text-align: center;
    }
    h2{
        margin-top: 50px;
        margin-bottom: 20px;
        font-size: 36px;

        text-align: center;
    }

    .prof-icon{
        width: 170px;
        display:block;
        margin-left: auto;
        margin-right: auto;
    }
    .section{
        margin-left:40px;
        width: 200;
        height: 50;
        margin: 3;
    }
    .profile{
        margin-left: auto;
        margin-right: 22%;
        font-size: 25px;

    }
    .edit{
        margin-right: 20px;
    }
    .button {
  border: none;
  color: white;
  padding: 15px 150px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
    }
    .button1 {
        background-color: #70D6FF;} 
    #about
    {
    margin-left:40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 50px; 
    width: 355px;
    height: 20px;  
    }
    #tag
    {
    margin-left:40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 25px; 
    width: 355px;
    height: 20px;  
    }
    #waiver
    {
    margin-left:40px;
    border-radius: 10px;
    border: 2px solid #000000;
    padding: 25px; 
    width: 355px;
    height: 20px;  
    }
    input::placeholder{
        position:absolute;
        left:20px;
        top:12.5px;
        background-color: white;
        padding: 0 2px;
    }




</style>