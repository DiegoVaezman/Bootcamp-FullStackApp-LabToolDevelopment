const User = require("../models/user")
// const Comment = require("../models/comment")
const UserCount = require("../models/userCount")
const Router = require("express").Router
const bcrypt = require("bcrypt");
const protectedRoute = require("../middlewares/protectedRoute")
const {validatePassword, validateEmail, validateString} = require("../helpers/validations")

const router = new Router()

//obteniendo todos los usuarios registrados
router.get("/", protectedRoute, (req, res) => {
    User.find({ $and: [ {fullname:{ $ne: "AutomaticUser" }}, {fullname:{ $ne: "Guest user"}} ] }, function (err, users) {
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        if (users.length == 0) {
            return res.status(200).send({msg: "There are no users"})
        }
        res.status(200).send(users)
    })
})

//creando nuevo usuario
router.post("/newuser", (req, res) => {

    const fullname = req.body.fullname
    const position = req.body.position
    const email = req.body.email
    const password = req.body.password
    const rol = req.body.rol

    if (!fullname || !email || !password || !rol) {
        return res.status(400).send({ msg: "Fullname, email, password and rol are required"})
    }

    try {
        validatePassword(password)
        validateEmail(email)
        validateString(fullname)

        User.findOne({email:email}, function (err, user){
            if (err) throw err;
            if (user) {
                return res.status(400).send({msg: `User email already registered`})
            }
        
            bcrypt.hash(password, 10, function(err, hash) {
                if (err) throw err;

                const user = new User({
                    fullname: fullname,
                    position: position,
                    email: email,
                    password: hash,
                    rol: rol
                })
                user.save()
                .then(doc => res.status(201).send(doc)) 
                .catch(error => {
                    res.status(400).send({msg: error.message})
                })
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

// //obteniendo todos los commentarios del usuario logueado
// router.get("/comments", protectedRoute, (req, res) => {
    
//     Comment.find({owner : req.decoded.id}, function (err, comments) {
//         if (err) {
//             res.status(400).send({ msg: err.message})
//         }
//         if (comments.length == 0) {
//             return res.status(200).send({ msg: "There are not comments from this user"})
//         }
//         res.status(200).send(comments)
//     })
// })

//obteniendo el usuario logueado
router.get("/user", protectedRoute, (req, res) => {
    User.findById((req.decoded.id), function (err, user) {
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        res.status(200).send(user)
    })
})

//eliminando el usuario logueado
router.delete("/deleteuser", protectedRoute, (req, res) => {
    User.deleteOne({ _id : req.decoded.id}, function (err, result){
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        res.status(200).send({msg:"User deleted"});
    })
})

//modificando usuario logueado
router.put("/modify", protectedRoute, (req, res) => {
    
    let fullname = req.body.fullname
    let position = req.body.position

    try {
        if (fullname == undefined) {
            fullname = req.decoded.fullname
        }
        if (position == undefined) {
            position = req.decoded.position
        }
        validateString(fullname)
        validateString(position)
        
        User.updateOne({ _id : req.decoded.id}, {$set: {fullname : fullname, position : position} }, function(err, result) {
            if (err) throw err;
            res.status(200).send({fullname : fullname, position : position})
        })
    } catch (error) {
        res.status(401).send({ msg: error.message})
    }
})

//obteniendo usuario por id
router.get("/:id", protectedRoute, (req, res) => {
    try{
        User.findById(req.params.id, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(400).send({ msg: "This user_id dose not exist."})
            }
            res.status(200).send(user)
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})  
    }
})

//login count
router.post("/loginCount", protectedRoute, (req, res) => {
    const userCount = new UserCount({
        user: req.body.fullname,
        date: req.body.date
    })
    userCount.save()
    .then(doc => res.send(doc)) 
    .catch(error => {
        res.send(error.message)
    })
})


module.exports = router