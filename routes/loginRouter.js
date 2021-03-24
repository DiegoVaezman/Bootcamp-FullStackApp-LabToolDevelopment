const User = require("../models/user")
const Router = require("express").Router
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {validatePassword, validateEmail} = require("../helpers/validations")
const tokenpass = process.env.TOKENPASS

const router = new Router();



router.post("/", (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        validateEmail(email)
        validatePassword(password)

        User.findOne({email : email}, function (err, user){
            if (err) throw err;
            if(!user) res.status(400).send({msg: "There is no user with this Email"});

            bcrypt.compare(password, user.password).then(samepassword => {
                if (!samepassword) {
                    return res.status(400).send({msg: "Password incorrect"});
                }
                //Genera el token
                const userPayload = {id: user._id, fullname: user.fullname, position: user.position, rol: user.rol}
                const token = jwt.sign(userPayload, tokenpass, {
                    expiresIn: 60 * 60 * 24
                })
                res.status(200).send({token: token, msg: "correct authentication"})
            })
        })

    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})      
    


//intentando hacer la autenticación de usuario mediante async/awayt


//     async function authenticateUser(req, res) {

//         try {
//             const user = await User.findOne({email : email});
//             if (user) {
//                 const comparePassword = await bcrypt.compare(password, user.password);
//                 if (!comparePassword) {
//                     return res.send("password incorrect")
//                 }
//                 console.log(comparepassword)
//                 res.send("ok")
//             }
//         } catch(err) {
//             console.log(err)
//         }
//     }
//     authenticateUser().then(nose => 
//     res.send(nose)
//     )
// })   



module.exports = router