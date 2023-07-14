//Authentication (Encryption and Decryption)
const express = require('express');
const jwt = require('jsonwebtoken'); //library for authentication creating json tokens 
const app = express();
app.use (express.json);

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey =  "superS3cr3t1"; // replace this with your own secret key

// for creating the json token (gibberish) for users taking the username as parameter  [ENCRYPTION]
const generateJwt = (user) => {
    const payload = { username: user.username, }; 
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); //creates the token using the secretKey and it stays for a timespan of 1hr 
  };

//[DECRYPTION]  Middleware for authentication 
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;  //Bearer {token}
  
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // accepting the 1st element only, ie, the baerer which is the encrypted token 
  
      jwt.verify(token, secretKey, (err, user) => {   // decryption happens where it checks whether the token(gibberish) is of the originalString ie, user here, using the secretKey technique of encryption 
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  
  //Admin sign up 
  app.post('/admin/signup', (req,res)=>{
    const admin = req.body;
    const existingAdmin = ADMINS.find(a=> a.username === admin.username); // finds whether admin already existed or not 
    if(existingAdmin){
      res.status(403).json({message:'Admin already existed '});
    }
    else{
      ADMINS.push(admin);
      const token = generateJwt(admin); // the admins token is created and encrypted 
      res.json({message:' Admin created successfully ', token });
    }
  });

  //Admins login 
  app.post('/admin/login',(req,res)=>{
    const {username, password} = req.headers;
    const admin = ADMINS.find( a=> a.username === username && a.password === password );
    if(admin){
      const token = generateJwt(admin); // generating the token encryption 
      res.json({ message: 'Admin logged in successfully ', token });
    }
    else{
      res.status(403).json({ message: 'Admin authentication failed '});
    }
  });

  // admins courses route , for creating courses by admins 
  app.post('/admin/courses' , authenticateJwt, (req,res) =>{
    console.log(req.user.username);
    const course = req.body;
    course.id = COURSES.length +1;
    COURSES.push(course);
    res.json({ message: ' Course created successfully ', courseId: course.id});
  });

  // Course updation route for admins
app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(c => c.id === courseId);

  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  res.json ({ courses: COURSES });
}); 