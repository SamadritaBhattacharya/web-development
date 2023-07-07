const express= require('express');
const app =express();
app.use (express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Middleware 
const adminAuthentication = (req,res,next)=>{
    const {username,password }= req.headers;
    // the above code is equal to 
    // const username= req.headers.username;
    //const password = req.headers.password;
    const admin = ADMINS.find( a=> a.username === username && a.password === password);
    // checks if an admin or not 
    if(admin){
        next();  // calls the next callback function from where it is called previously, ie, the login()
    }
    else{
        res.status(403).json({ message: 'Admin authentication failed.'});
    }        
};

// sign up for admins for admins router 
app.post('/admin/signup',(req,res)=>{
    const admin = req.body;  //admins ={username:"abc123@gmail.com", password: "amkan123213"}
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

// admin login 
app.post('/admin/login',adminAuthentication,(req,res)=>{
    res.json({ message:'Logged in successfully'});
});
// courses
app.post('admin/courses', adminAuthentication, (req,res)=>{
    const course = req.body;
    course.id = Date.now(); // use timestamp as course ID
    COURSES.push(course);
    res.json({ message: 'Course updated successfully', courseId: course.id});
})