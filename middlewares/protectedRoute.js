const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenpass = process.env.TOKENPASS

//middleware token authentication
const protectedRoute = (req, res, next) => {
    console.log("protected rute")
    let token = req.headers.authorization;
  console.log(token)
    if (token) {
        token = token.replace('Bearer ', '')
        jwt.verify(token, tokenpass, (err, decoded) => {      
        if (err) {
          console.log("error verificando token invalid token")
          return res.status(401).send({ msg: 'Invalid token' });    
        }
        req.decoded = decoded;  
        next();
      });
    } else {
      console.log("no hay token")
    res.status(401).send({ msg: 'Token no provided.'});
    }
 };


 module.exports = protectedRoute