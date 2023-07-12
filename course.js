const express= require('express');
const app =express();
app.use (express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Middleware for admins 
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

// Middleware for users 
const userAuthentication = (req,res,next)=>{
    const {username, password } = req.headers;
    const user = USERS.find(u=> u.username === username && u.password === password );
    if(user){
        req.user = user; // add user object to the request  
        next();
    }
    else{
        res.status(403).json({ message: 'User authentication failed.'});
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
// calling middleware 
app.post('/admin/login',adminAuthentication,(req,res)=>{
    res.json({ message:'Logged in successfully'});
});
// courses
app.post('admin/courses', adminAuthentication, (req,res)=>{
    const course = req.body;

    // if(!course.title){
    //     return res.json(411).send({ message:'Please send me the title '})
    // }   check for proper title 
    course.id = Date.now(); // use timestamp as course ID
    COURSES.push(course);
    res.json({ message: 'Course updated successfully', courseId: course.id});
})
// updating courses from admin 
app.put('admin/courses/:courseId',adminAuthentication, (req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const course = COURSES.find(c=> c.id=== courseId); // the random id returned in the post courses function in line 64
    if(course){
        Object.assign(course,req.body); // updated in-memory replace  
        // can also be written as 
        // course.title = req.body.title;
        // course.price = req.body.price;
        res.json({ message: 'Course updated successfully '});
    }
    else{
        res.status(404).json({ message: 'Course not found '});
    }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
    res.json({ courses: COURSES });
  });

  // user signup 
  app.post('/users/signup', userAuthentication, (req,res)=>{
    const user = {...req.body , purchasedCourses:[]};
    // // the above code is equal to 
    // // const user ={
    //     username: req.body.username'
    //     password: req.body.password '
    //     purchasedCourses:[]
    // }
    USERS.push(user);
    res.json({ message: 'User created successfully '});
  });

  // users login 
  app.post('/users/login', userAuthentication,(req,res)=>{
    res.json({ message: 'Logged in successfully '});
  });
// getting courses from users  
  app.get('/users/courses', userAuthentication,(req,res)=>{
    res.json({ courses: COURSES.filter(c => c.published)});
    // let filteredCourses=[];
    // for(let i=0;i<COURSES.length;i++){
    //     if(COURSES[i].published){
    //         filteredCourses.push(COURSES[i]);
    //     }
    // res.json({ courses: filteredCourses});
    // }  same logic for above .filter() one 
  });

  // users purchase the course
  app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
    const courseId = Number(req.params.courseId);
    const course = COURSES.find(c => c.id === courseId && c.published);
    if (course) {
      req.user.purchasedCourses.push(courseId);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(404).json({ message: 'Course not found or not available' });
    }
  });
app.listen(3000);

  
