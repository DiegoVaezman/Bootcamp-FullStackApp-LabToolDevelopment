const Comment = require("../models/comment")
const Order = require("../models/order")
const Router = require("express").Router
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateString} = require("../helpers/validations")

const router = new Router()



router.get("/", (req, res) => {
    
    Comment.find({}, function (err, comments){
        if (err) {
            res.status(400).send({ msg: err.message})
            console.log(err)
        }
        if (comments.length == 0) {
            return res.send({msg: "There are no comments"})
        }
        res.send(comments)
    })
})




//ver los comentarios de un pedido
router.get("/:id", (req, res) => {
    try {
        validateId(req.params.id)

        Order.findById(req.params.id, function (err, order){
            if(err) throw err;
            if (!order) {
                console.log(`This order_id dose not exist.`)
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }
            Comment.find({order : req.params.id}, function (err, comment){
                if (err) throw err;
                if (comment.length == 0) {
                    return res.send({ msg: "There is not comment on this order"})
                }
                res.send(comment)
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})




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
                console.log(`This order_id dose not exist.`)
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }

            //Crea el comentario y lo guarda en la collección de comentarios
            const comment = new Comment({
                owner: owner,
                text: text,
                order : order
            })
            comment.save()
            .then(doc => res.send(doc)) 
            .catch(error => {
                res.status(400).send({msg: error.message})
                console.log(error)
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})



router.delete("/deletecomment/:id", protectedRoute,(req, res) => {
    try {
        validateId(req.params.id)
        
        Comment.findById(req.params.id, function (err, comment) {
            if(err) throw err;
            if (!comment) {
                console.log(`This comment_id dose not exist.`)
                return res.status(400).send({ msg: "This comment_id dose not exist."})
            }
            if(comment.owner != req.decoded.id) {
                console.log(`You do not have permission for delete this comment`)
                return res.status(401).send({msg : `You do not have permission for delete this comment`})
            }
            
            //elimina el comentario de la coleccion de comentarios
            Comment.deleteOne({ _id : req.params.id}, function (err, result){
                if (err) throw err;
                res.send({msg:"Comment deleted"});
                console.log("Deleted comment on Comments collection")
            })
        })  
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})



module.exports = router