const User = require("../models/user")
const Comment = require("../models/comment")
const Router = require("express").Router



const router = new Router()





router.get("/", (req, res) => {
    User.find({})
    .then(users => {
        if (users.length == 0) {
            return res.send({msg: "There are no users"})
        }
        res.send(users)})
    .catch(error => console.log(error))
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
    if (password.length < 6) {
        return res.status(400).send({ msg: "password must be at least 6 characters long"})
    }

    const user = new User({
        fullname: fullname,
        position: position,
        email: email,
        password: password,
        rol: rol
    })

    user.save()
    .then(doc => res.send(doc)) 
    .catch(error => console.log(error))
})




router.get("/:id/comments", (req, res) => {

    Comment.find({owner : req.params.id}).then(comment => {
        if (comment.length == 0) {
            return res.send({ msg: "There are not comments from this user"})
        }
        else{
            res.send(comment)
        }
    })
    .catch(error => console.log(error))

})




router.delete("/deleteuser/:id", (req, res) => {
    
        //elimino usuario de User collection
        User.deleteOne({ _id : req.params.id}, function (err, result){
            if (err) throw err;
            res.send((result.deletedCount === 1) ? {msg:"success"} : {msg:"error"});
            console.log("Deleted user on User collection")
        })
    
})



router.put("/:id/modify", (req, res) => {
    
    User.updateOne({ _id : req.params.id}, {$set: req.body }, function(err, result) {
        if (err) throw err;
        res.send({msg: "User modified"})
        console.log(`User ${req.params.id} modified on User collection`)
    })
})


module.exports = router