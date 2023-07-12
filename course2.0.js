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
      const token = authHeader.split(' ')[1]; // accepting the 1st element only , ie the baerer which is the encrypted token 
  
      jwt.verify(token, secretKey, (err, user) => {
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
  