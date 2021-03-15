const User = require("../models/user")
const Router = require("express").Router
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = new Router();



router.post("/", (req, res) => {

    const email = req.body.email
    const password = req.body.password

    if (typeof email !== "string") throw new TypeError(`${email} in not an email`)
    if (!email.trim().length) throw new Error(`Password is empty or blank`)
    // if (!/^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.test(email)) throw new Error (`${email} is not valid`)

    if (!password.trim().length) throw new Error(`password is empty or blank`)
    if (typeof password !== "string") throw new TypeError(`${password} is not a password`)
    if (password.legth < 6) throw new Error('Password must be at least 6 characters long')


    User.findOne({email : email}).then(user => {
        if (!user) return res.status(403).send({msg: "Email incorrect."})

        bcrypt.compare(password, user.password).then(samepassword => {
            if (!samepassword) {
                res.status(403).send({msg: "Password incorrect"});
            }
            //Genera el token
            const userPayload = {id: user._id, username: user.fullname, rol: user.rol}
            const token = jwt.sign(userPayload, "secret password", {
                expiresIn: 60 * 60 * 24
            })
            res.json({token: token, msg: "correct authentication"})
        })
    })
    .catch(error => {
        console.log("Error authenticating user")
        console.log(error)
    })
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