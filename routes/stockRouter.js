const Router = require("express").Router
const Stock = require("../models/stock")
const Order = require("../models/order")
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateNumber, validateBoolean, validateString} = require("../helpers/validations")

const router = new Router()



router.get("/", protectedRoute, (req, res) => {

    Stock.find({}, function (err, stocks) {
        if (err) {
            res.status(400).send({ msg: err.message})
            console.log(err)
        }
        if (stocks.length == 0) {
            return res.send({msg: "There are no items"})
        }
        res.send(stocks)
    })
})



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
            const recived = Date.now()        

        
            //Actualiza el status del order a recived
            Order.updateOne({_id : req.params.id}, {$set: {status : "recived"} }, function(err, result) {
                if (err) throw err;
                console.log(`Order status modified to "recived"`)
            })


            //si existen más pedidos de ese producto -> request se mantiene en true
            Order.find({ $and: [{product: order.product}, {status : { $in: ["validated", "waiting"] }}] }, function (err, ordersfound) {
                if (err) throw err;
                if (ordersfound.length > 1) {
                    request = true
                }
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
                            recived : recived
                        })

                        newitem.save()
                        .then(doc => res.send(doc)) 
                        .catch(error => {
                            res.status(400).send({msg: error.message})
                            console.log(error)
                        })
                        return
                    }

                    //si ya existe en stock, se actualiza
                    const totalAmount = Number(item.amount) + Number(amount)

                    Stock.updateOne({ product : product}, {$set: {amount: totalAmount, status: "In stock", recived: Date.now(), request: request} }, function(err, result) {
                        if (err) throw err;
                        console.log(`Item modified in Stock collection`)
                        res.send({ msg: "The Item is already in stock and was updated in Stock collection"})
                    })
                })
            )
        })   
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})


router.put("/reduce/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
    
        Stock.findById(req.params.id, function (err, item) {
            if(err) throw err;
            if (!item) {
                console.log(`This itme_id dose not exist.`)
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            if (item.amount == 0) {
                return res.send({msg: "There is no item amount to reduce"})
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
                    Order.findOne({ $and: [{user:"6053a5cf6c15b8560c74af9a"}, {status : { $in: ["validated", "waiting"]} }] }, function (err, orderfound) {
                        if (err) throw err;
                        if (orderfound) {
                            console.log("Item amount modified")
                            return res.send({ msg:"Amount reduced"})
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
                        .then(doc => res.send({msg: "Amount reduced and new order registered", doc : doc}))
                        .catch(error => {
                            res.status(400).send({msg: error.message})
                            console.log(error)
                        })
                        console.log("Amount reduced and new order registered")
                    })
                }
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})



router.put("/:id/modify", protectedRoute, (req, res) => {

    try {
        validateId(req.params.id)
    
        Stock.findById(req.params.id, function (err, item){
            if (err) throw err;
            if (!item) {
                console.log(`This item_id dose not exist.`)
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
        
            let amount = req.body.amount
            let storage = req.body.storage
            let limit = req.body.limit
            let control = req.body.control
            let automaticamount = req.body.automaticamount

            if (amount == undefined) {
                amount = item.amount
            }
            if (storage == undefined) {
                storage = item.storage
            }
            if (limit == undefined) {
                limit = item.limit
            } 
            if (automaticamount == undefined) {
                automaticamount = item.automaticamount
            } 
            if (control == undefined) {
                control = item.control
            }

            try {
            validateNumber(amount)
            validateString(storage)
            validateNumber(limit)
            validateNumber(automaticamount)    
            validateBoolean(control)
            } catch (error) {
                res.status(400).send({ msg: error.message})  
            }
            
            Stock.updateOne({ _id : req.params.id}, {$set: {amount : amount, storage : storage, limit : limit, control : control, automaticamount : automaticamount} }, function(err, result) {
                if (err) throw err;
                res.send({msg: "Item modified"})
                console.log(`Item ${req.params.id} modified on Stock collection`)
            })
        })
    } catch (error) {
        console.log("voy al catch")
        res.status(400).send({ msg: error.message})
    }
})



router.delete("/deleteitem/:id", protectedRoute, (req, res) => {

    try {
        validateId(req.params.id)

        Stock.findById(req.params.id, function (err, item) {
            if (!item) {
                console.log(`This item_id dose not exist.`)
                return res.status(400).send({ msg: "This item_id dose not exist."})
            }
            Stock.deleteOne({ _id : req.params.id}, function (err, result){
                if (err) throw err;
                res.send({msg:"Item deleted"});
                console.log("Deleted item in Stock collection")
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})


module.exports = router