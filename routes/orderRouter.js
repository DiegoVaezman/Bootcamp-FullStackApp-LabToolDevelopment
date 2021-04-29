const Router = require("express").Router
const Order = require("../models/order")
const Comment = require("../models/comment")
const Product = require("../models/product")
const Stock = require("../models/stock")
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateNumber} = require("../helpers/validations")

const router = new Router()

//obteniendo todas las solicitudes de pedidos
router.get("/", (req, res) => {

    Order.find({})
    .populate("product user")
    .exec (function (err, orders) {
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        if (orders.length == 0) {
            return res.status(200).send({msg: "There are no orders"})
        }
        res.status(200).send(orders)})
})

//nueva solicitud de pedido
router.post("/neworder/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)

        Product.findById(req.params.id, function (err, products) {
            if (err) throw err;
            if (!products) {
                return res.status(400).send({ msg: "This product_Id dose not exist."})
            }
            const product = req.params.id
            const amount = req.body.amount      //se requiere por formulario
            const user = req.decoded.id    
            const status = "waiting"       

            if (!amount) {
                return res.status(400).send({ msg: "Amount is required"})
            }
            
            try {
                validateNumber(amount)
            } catch (error) {
                return res.status(400).send({ msg: error.message})  
            }
            
            //actualiza el estado del item a "request"
            Stock.updateOne({ product : product}, {$set: {request: true} }, function(err, result) {
                if (err) throw err;
                if (result) {
                    console.log(`Item request modified to true`)
                }
            })

            //Crea el pedido y lo guarda en la collección de Orders
            const order = new Order({
                product :product,
                amount : amount,
                user :user,
                status : status,
                comments :[],
                date : Date.now()
            })
            order.save()
            .then(doc => res.status(201).send(doc)) 
            .catch(error => {
                res.status(400).send({msg: error.message})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//validando solicitud
router.put("/validate/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
    
        //Comprobar que el usuario logueado tiene rol validator
        if (req.decoded.rol !== "validator") {
            return res.status(401).send({ msg: "You do not have permission for validate an order"})
        }

        Order.findById(req.params.id, function (err, order){
            if(err) throw err;
            if (!order) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }

            Order.updateOne({ _id : req.params.id}, {$set: {status: "validated"} }, function(err, result) {
                if (err) throw err;
                if (result) {
                    //actualiza el estado del item a "request"
                    Stock.updateOne({ product : order.product}, {$set: {request: true} }, function(err, result) {
                        if (err) throw err;
                        if (result) {
                            console.log(`Item request modified to true`)
                        }
                    })
                }
                res.status(200).send({ msg:"Order validated"})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//rechazando solicitud
router.put("/reject/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
        
        //Comprobar que el usuario logueado tiene rol validator
        if (req.decoded.rol !== "validator") {
            return res.status(401).send({ msg: "You do not have permission for reject an order"})
        }

        Order.findById(req.params.id, function (err, order){
            if (err) throw err;
            if (!order) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }
            Order.updateOne({ _id : req.params.id}, {$set: {status: "rejected"} }, function(err, result) {
                if (err) throw err;
                if (result){
                    //si existen más pedidos de ese producto -> item/request se mantiene en true
                    Order.findOne({ $and: [{product: order.product}, {status : { $in: ["validated", "waiting"] }}] }, function (err, ordersfound) {
                        if (err) throw err;
                        if (!ordersfound) {
                            Stock.updateOne({ product : order.product}, {$set: {request: false} }, function(err, result) {
                                if (err) throw err;
                            })
                        }
                    })
                }
                res.status(200).send({ msg:"Order rejected"})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//eliminando solicitud
router.delete("/deleteorder/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
        
        Order.findById(req.params.id, function (err, order) {
            if (!order) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }
            //elimina el producto de la coleccion de cproducto
            Order.deleteOne({ _id : req.params.id}, function (err, result){
                if (err) throw err;
                if (result){
                    //si existen más pedidos de ese producto -> item/request se mantiene en true
                    Order.findOne({ $and: [{product: order.product}, {status : { $in: ["validated", "waiting"] }}] }, function (err, ordersfound) {
                        if (err) throw err;
                        if (!ordersfound) {
                            Stock.updateOne({ product : order.product}, {$set: {request: false} }, function(err, result) {
                                if (err) throw err;
                            })
                        }
                    })
                    //eliminar comentarios de la BD referentes al pedido.
                    Comment.deleteMany({ order : req.params.id}, function (err, result){
                        if (err) throw err;
                    })
                }
                res.status(200).send({msg:"Order deleted"});
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})  
    }
})

//obteniendo solicitudes en espera
router.get("/waiting", protectedRoute, (req, res) => {
    Order.find({status : "waiting"}) 
    .populate("product user")
    .exec (function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "Empty waiting"})
        }
        res.status(200).send(orders)
    })
})

//obteniendo solicitudes validadas
router.get("/validated", protectedRoute, (req, res) => {
    Order.find({status : "validated"})
    .populate("product user")
    .exec (function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "Empty validated"})
        }
        res.status(200).send(orders)
    })
})

//obteniendo solicitudes recibidas
router.get("/received", protectedRoute, (req, res) => {

    Order.find({status : "received"})
    .populate("product user")
    .exec (function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "Empty received"})
        }
        res.status(200).send(orders)
    })
})

//obteniendo solicitudes rechazadas
router.get("/rejected", protectedRoute, (req, res) => {

    Order.find({status : "rejected"})
    .populate("product user")
    .exec (function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "There is not rejected order"})           //SE PODRÍA ELIMINAR
        }
        res.status(200).send(orders)
    })
})

//obteniendo una solicitud por id
router.get("/:id", protectedRoute, (req, res) => {
    try{
        validateId(req.params.id)
        Order.findById(req.params.id)
        .populate("product user")
        .exec (function (err, order) {
            if (err) throw err;
            if (!order) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }
            res.status(200).send(order)
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})  
    }
})

module.exports = router