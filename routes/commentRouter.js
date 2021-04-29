const Comment = require("../models/comment")
const Order = require("../models/order")
const Router = require("express").Router
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateString} = require("../helpers/validations")

const router = new Router()

// router.get("/", protectedRoute, (req, res) => {
//     Comment.find({}, function (err, comments){
//         if (err) {
//             res.status(400).send({ msg: err.message})
//         }
//         if (comments.length == 0) {
//             return res.status(200).send({msg: "There are no comments"})
//         }
//         res.status(200).send(comments)
//     })
// })


//ver los comentarios de un pedido
router.get("/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
        // Order.findById(req.params.id, function (err, order){
        //     if(err) throw err;
        //     if (!order) {
        //         return res.status(400).send({ msg: "This order_id dose not exist."})
        //     }
            Comment.find({order : req.params.id})
            .populate("owner")
            .exec (function (err, comment){
                if (err) throw err;
                if (comment.length == 0) {
                    return res.status(200).send({ msg: "No comments"})
                }
                res.status(200).send(comment)
            })
        // })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//nuevo comentario
router.post("/newcomment/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
        const text = req.body.text
        const owner = req.decoded.id   //sera el id del usuario logueado.
        const order = req.params.id

        if (!text) {
            return res.status(400).send({ msg: "Text is required"})
        }
        validateString(text)
        Order.findById(req.params.id, function (err, orderfound){
            if (err) throw err;
            if (!orderfound) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }
            //Crea el comentario y lo guarda en la collección de comentarios
            const comment = new Comment({
                owner: owner,
                text: text,
                order : order
            })
            comment.save()
            .then((doc) => {
                res.status(201).send(doc)
                Order.updateOne({ _id : req.params.id}, {$push: {comments : doc.id} }, function(err, result) {
                    if (err) throw err;
                })
            }) 
            .catch(error => {
                res.status(400).send({msg: error.message})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//eliminar comentario
router.delete("/deletecomment/:id", protectedRoute,(req, res) => {
    try {
        validateId(req.params.id)
        
        Comment.findById(req.params.id, function (err, comment) {
            if(err) throw err;
            if (!comment) {
                return res.status(400).send({ msg: "This comment_id dose not exist."})
            }
            if(comment.owner != req.decoded.id) {
                return res.status(401).send({msg : `You do not have permission for delete this comment`})
            }
            //elimina el comentario del array de comentarios del order document
            Order.updateOne({_id: comment.order}, { $pull: {comments: req.params.id}}, function(err, result) {
                if (err) throw err;
            })
            //elimina el comentario de la coleccion de comentarios
            Comment.deleteOne({ _id : req.params.id}, function (err, result){
                if (err) throw err;
                res.status(200).send({msg:"Comment deleted"});
            })
        })  
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

module.exports = router