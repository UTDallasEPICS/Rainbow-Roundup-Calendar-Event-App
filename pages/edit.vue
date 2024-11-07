

<template>
    <div class="flex flex-row items-center">
        <a href ="./profile"><img class="backArrow" src="../public/images/backArrow.png" alt="Profile Page "></a>
        <h1 class="profile "><b>Edit Profile</b></h1>
        <br>
        <br>
    </div>
    <div class= "flex flex-col items-center">
         <img class="prof-icon" src="../public/images/ProfileImage.png" alt="Profile Page ">
         <p class="text">Change Profile</p>
         <p class="text">Picture</p>
    
         
    </div>
    <div>   
        <br>  
        <br>
        <input type="name" id="name" placeholder = "Full Name"/>
        <br>
        <br><br>
        <input type="name" id="name" placeholder = "User Name"/>
        <br><br><br>
        <input type="name" id="name" placeholder = "Email"/>
         <br><br><br>
         <input type="name" id="name" placeholder = "Phone Number"/>
    </div>
    <div class="flex flex-col items-center">
        <br>
    <button class="button button1"><a href="./profile">Save Changes</a></button>
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
            margin-right: 34%;
            font-size: 25px;
    
        }

        .button {
      border: none;
      color: white;
      padding: 15px 130px;
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
        #name
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
        .backArrow{
            margin-left:80%;
            height: 30px;

        }
    
    
    
    
    </style>