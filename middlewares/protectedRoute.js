const express = require("express");
const jwt = require("jsonwebtoken");



//middleware token authentication
const protectedRoute = express.Router(); 
protectedRoute.use((req, res, next) => {
    console.log(req.headers) 
    let token = req.headers['access-token'];
 
    if (token) {
        token = token.replace('Bearer ', '')
        jwt.verify(token, "secret password", (err, decoded) => {      
        if (err) {
          return res.send({ msg: 'Invalid token' });    
        }
        req.decoded = decoded;  
        console.log(req.decoded) 
        next();
      });
    } else {
    res.send({ msg: 'Token no provided.'});
    }
 });


 module.exports = protectedRoute