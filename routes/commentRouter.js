const Comment = require("../models/comment")
const User = require("../models/user")
const Router = require("express").Router



const router = new Router()



router.get("/", (req, res) => {

    Comment.find({})
    .then(comment => res.send(comment))
    .catch(error => console.log(error))
})



//ver los comentarios de un pedido
router.get("/:id", (req, res) => {
    Comment.find({order : req.params.id}).then(comment => {
        if (comment.length == 0) {
            return res.send({ msg: "There is not comment on this order"})
        }
        res.send(comment)
    })
    .catch(error => console.log(error))
})




router.post("/newcomment/:id", (req, res) => {


    const text = req.body.text
    const owner = req.body.owner   //sera el id del usuario logueado.
    const order = req.params.id

    if (!text || !owner) {
        return res.status(400).send("Missing parameters")
    }
    //Crea el comentario y lo guarda en la collección de comentarios
  
    const comment = new Comment({
        owner: owner,
        text: text,
        order : order
    })

    comment.save()
    .then(doc => res.send(doc)) 
    .catch(error => console.log(error))
    
})



router.delete("/deletecomment/:id", (req, res) => {

   
    //elimina el comentario de la coleccion de comentarios
    Comment.deleteOne({ _id : req.params.id}, function (err, result){
        if (err) throw err;
        res.send((result.deletedCount === 1) ? {msg:"success"} : {msg:"error"});
        console.log("Deleted comment on Comments collection")
    })

})


router.put("/:id/modify", (req, res) => {

    //Actualiza el texto del comentario
    Comment.updateOne({ _id : req.params.id}, {$set: {text: req.body.text} }, function(err, result) {
        if (err) throw err;
        res.send({msg: "Comment modified"})
        console.log(`Comment ${req.params.id} modified on Comments collection`)
    })
})




module.exports = router