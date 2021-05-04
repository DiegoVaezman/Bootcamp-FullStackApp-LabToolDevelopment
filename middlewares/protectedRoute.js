const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenpass = process.env.TOKENPASS

//middleware token authentication
const protectedRoute = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        token = token.replace('Bearer ', '')
        jwt.verify(token, tokenpass, (err, decoded) => {      
        if (err) {
          return res.status(401).send({ msg: 'Invalid token' });    
        }
        req.decoded = decoded;  
        next();
      });
    } else {
    res.status(401).send({ msg: 'Token no provided.'});
    }
 };


 module.exports = protectedRoute