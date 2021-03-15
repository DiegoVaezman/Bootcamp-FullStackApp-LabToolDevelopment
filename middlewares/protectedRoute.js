const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenpass = process.env.TOKENPASS

//middleware token authentication
const protectedRoute = (req, res, next) => {
    console.log(req.headers) 
    let token = req.headers['access-token'];
 
    if (token) {
        token = token.replace('Bearer ', '')
        jwt.verify(token, tokenpass, (err, decoded) => {      
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
 };


 module.exports = protectedRoute