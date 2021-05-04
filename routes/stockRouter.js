const Router = require("express").Router
const Stock = require("../models/stock")
const Order = require("../models/order")
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateNumber, validateBoolean, validateString} = require("../helpers/validations")

const router = new Router()

//obteniendo todos los items
router.get("/", protectedRoute, (req, res) => {
    Stock.find({})
    .populate("product")
    .exec (function (err, stocks) {
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        if (stocks.length == 0) {
            return res.status(200).send({msg: "There are no items"})
        }
        res.status(200).send(stocks)
    })
})

//agregando nuevo item al stock
router.post("/newitem/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
    
        Order.findById(req.params.id, function (err, order) {
            if (err) throw err
            if (!order) return res.status(400).send({ msg: "This order_Id dose not exist."})
            if (order.status !== "validated") return res.status(405).send({ msg: 'The status order is not "validated"'})
        
            const product = order.product       
            const amount = order.amount   
            const storage = req.body.storage   //campo de formulario
            const status = "In stock"        
            let request = false   
            const received = Date.now()        

            //Actualiza el status del order a received
            Order.updateOne({_id : req.params.id}, {$set: {status : "received"} }, function(err, result) {
                if (err) throw err;
                if (result) {
                    //si existen más pedidos de ese producto -> request se mantiene en true
                    Order.findOne({ $and: [{product: order.product}, {status : { $in: ["validated", "waiting"] }}] }, function (err, ordersfound) {
                        if (err) throw err;
                        if (ordersfound) {
                            request = true
                        }
                    })
                }
                console.log(`Order status modified to "received"`)
            })
            .then(
                Stock.findOne({product : product}, function (err, item) {
                    if (err) throw err;

                    //si no existe el producto en stock, crea el item y lo guarda en la colleción de Stocks
                    if (!item) {
                        const newitem = new Stock({
                            product : product,    
                            amount : amount,
                            storage : storage,
                            status : status,
                            request : request,
                            received : received
                        })

                        newitem.save()
                        .then(doc => res.status(201).send({ msg: "Added to stock"})) 
                        .catch(error => {
                            res.status(400).send({msg: error.message})
                        })
                        return
                    }

                    //si ya existe en stock, se actualiza
                    const totalAmount = Number(item.amount) + Number(amount)

                    Stock.updateOne({ product : product}, {$set: {amount: totalAmount, status: "In stock", received: Date.now(), request: request} }, function(err, result) {
                        if (err) throw err;
                        res.status(200).send({ msg: "The Item was updated in Stock"})
                    })
                })
            )
        })   
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//reduciendo la  cantidad de item en stock
router.put("/reduce/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
    
        Stock.findById(req.params.id, function (err, item) {
            if(err) throw err;
            if (!item) {
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            if (item.amount == 0) {
                return res.status(200).send({msg: "There is no item amount to reduce"})
            }
            
            const amount = Number(item.amount) - 1

            //si la cantidad llega a 0, se cambia el status del item a "out of stock"
            let status = item.status
            if (amount == 0) {
                status = "Out of stock"
            }

            Stock.updateOne({ _id : req.params.id}, {$set: {amount: amount, status : status} }, function(err, result) {
                if (err) throw err;
                
                //-----------LÍMITE------------- 
                if (item.control === true && amount <= item.limit) {

                    //comprueba que no hay pedido automático para este producto
                    Order.findOne({ $and: [{user:"6053a5cf6c15b8560c74af9a"}, {status : { $in: ["validated", "waiting"]} }, {product:item.product}] }, function (err, orderfound) {
                        if (err) throw err;
                        if (orderfound) {
                            return res.status(200).send({ msg:"Amount reduced"})
                        }
                        //actualiza el estado del item a "request true"
                        Stock.updateOne({ _id : req.params.id }, { $set: {request: true} }, function(err, result) {
                            if (err) throw err;
                            console.log(`Item request modified to true`)
                        })
                        //Crea el pedido y lo guarda en la colección de Orders
                        const order = new Order({
                            product : item.product,
                            amount : item.automaticamount,
                            user : "6053a5cf6c15b8560c74af9a",
                            status : "waiting",
                            date : Date.now()
                        })
                        order.save()
                        .then((doc) => {
                            //crea un comentario asociado al pedido automático
                            const comment = new Comment({
                                text : "Order authomaticaly requested",
                                owner : "6053a5cf6c15b8560c74af9a",
                                order : doc._id,
                                date : Date.now()
                            })
                            comment.save()
                            .then( (comment) => {
                                Order.updateOne({ _id : doc._id}, {$push: {comments : comment._id} }, function(err, result) {
                                    if (err) throw err;
                                })
                            })
                            res.status(201).send({msg: "Amount reduced and new order registered"})
                        })
                        .catch(error => {
                            res.status(400).send({msg: error.message})
                        })
                    })
                } else {
                    return res.status(200).send({ msg:"Amount reduced"})
                }
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//modificando item
router.put("/:id/modify", protectedRoute, (req, res) => {

    try {
        validateId(req.params.id)
    
        Stock.findById(req.params.id, function (err, item){
            if (err) throw err;
            if (!item) {
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
        
            let amount = req.body.amount
            let storage = req.body.storage
            
            if (amount == "") {
                amount = item.amount
            }
            if (storage == "") {
                storage = item.storage
            }
            
            try {
            validateNumber(amount)
            // if (item.storage != undefined){
            //     validateString(storage)
            // }
            } catch (error) {
                return res.status(400).send({ msg: error.message})  
            }
            
            Stock.updateOne({ _id : req.params.id}, {$set: {amount : amount, storage : storage} }, function(err, result) {
                if (err) throw err;
                return res.status(200).send({msg: "Item modified"})
            })
        })
    } catch (error) {
        return res.status(400).send({ msg: error.message})
    }
})

//estableciendo límite al item del stock
router.put("/:id/setlimit", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
    
        Stock.findById(req.params.id, function (err, item){
            if (err) throw err;
            if (!item) {
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            
            let limit = req.body.limit
            let control = req.body.control
            let automaticamount = req.body.automaticamount
            
            if (control === false) {
                limit = 0
                automaticamount = 0
            } else {
                if (!limit || !automaticamount) {
                    return res.status(400).send({ msg: "Minimum amount and quantity to order is required"})
                }
            }
            try {
            validateNumber(limit)
            validateNumber(automaticamount)    
            validateBoolean(control)
            } catch (error) {
                return res.status(400).send({ msg: error.message})  
            }
            
            Stock.updateOne({ _id : req.params.id}, {$set: {limit : limit, control : control, automaticamount : automaticamount} }, function(err, result) {
                if (err) throw err;
                return res.status(200).send({msg: "Stock limit control set"})
            })
        })
    } catch (error) {
        return res.status(400).send({ msg: error.message})
    }
})

//eliminando item del stock
router.delete("/deleteitem/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)

        Stock.findById(req.params.id, function (err, item) {
            if (!item) {
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            Stock.deleteOne({ _id : req.params.id}, function (err, result){
                if (err) throw err;
                res.status(200).send({msg:"Item deleted"});
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})

//obteniendo un solo item por su id
router.get("/:id", protectedRoute, (req, res) => {
    try{
        validateId(req.params.id)
        Stock.findById(req.params.id)
        .populate("product")
        .exec (function (err, item) {
            if (err) throw err;
            if (!item) {
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            res.status(200).send(item)
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})  
    }
})

module.exports = router