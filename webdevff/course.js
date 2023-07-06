const express= require('express');
const app =express();
app.use (express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// sign up for admins for admins router 
app.post('/admin/signup',(req,res)=>{
    const admin = req.body;  //admins username , email and password created.
    const existingAdmin = ADMINS.find(a=> a.username === admin.username);
    // if he/she is an existing user 
    if(existingAdmin){
        res.status(403).json({ message: 'Admin already exsits'});
    }
    else{
        ADMINS.push(admin);
        res.json({ message:'Admin created successfully' });
    }
});