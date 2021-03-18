const User = require("../models/user")
const Comment = require("../models/comment")
const Router = require("express").Router
const bcrypt = require("bcrypt");
const protectedRoute = require("../middlewares/protectedRoute")
const {validatePassword, validateEmail, validateString} = require("../helpers/validations")

const router = new Router()




router.get("/", (req, res) => {

    User.find({}, function (err, users) {
        if (err) {
            res.status(400).send({ msg: err.message})
            console.log(err)
        }
        if (users.length == 0) {
            return res.send({msg: "There are no users"})
        }
        res.send(users)
    })
})



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
                return res.send({msg: `User email already registered`})
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
                .then(doc => res.send(doc)) 
                .catch(error => {
                    res.status(400).send({msg: error.message})
                    console.log(error)
                })
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})




router.get("/comments", protectedRoute, (req, res) => {
    
    Comment.find({owner : req.decoded.id}, function (err, comments) {
        if (err) {
            res.status(400).send({ msg: err.message})
            console.log(err)
        }
        if (comments.length == 0) {
            return res.send({ msg: "There are not comments from this user"})
        }
        res.send(comments)
    })
})




router.delete("/deleteuser", protectedRoute, (req, res) => {
    
    //elimino usuario logueado de User collection
    User.deleteOne({ _id : req.decoded.id}, function (err, result){
        if (err) {
            res.status(400).send({ msg: err.message})
            console.log(err)
        }
        res.send({msg:"User deleted"});
        console.log("Deleted user on User collection")
    })
})



router.put("/modify", protectedRoute, (req, res) => {
    
    const fullname = req.body.fullname
    const position = req.body.position

    try {
        validateFullname(fullname)
        
        User.updateOne({ _id : req.decoded.id}, {$set: {fullname : fullname, position : position} }, function(err, result) {
            if (err) throw err;
            res.send({msg: "User modified"})
            console.log(`User ${req.decoded.id} modified on User collection`)
        })
    } catch (error) {
        res.status(401).send({ msg: error.message})
    }
})


module.exports = router