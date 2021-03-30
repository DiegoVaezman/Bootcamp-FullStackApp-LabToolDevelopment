const Router = require("express").Router
const Order = require("../models/order")
const Product = require("../models/product")
const protectedRoute = require("../middlewares/protectedRoute")
const {validateId, validateNumber} = require("../helpers/validations")

const router = new Router()



router.get("/", (req, res) => {

    Order.find({}, function (err, orders) {
        if (err) {
            res.status(400).send({ msg: err.message})
        }
        if (orders.length == 0) {
            return res.status(200).send({msg: "There are no orders"})
        }
        res.status(200).send(orders)})
})



router.post("/neworder/:id"
// , protectedRoute
, (req, res) => {

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
                console.log(`Item request modified to true`)
            })

            //Crea el pedido y lo guarda en la collección de Orders
            const order = new Order({
                product :product,
                amount : amount,
                user :user,
                status : status,
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
                res.status(200).send({ msg:"Order validated"})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})



router.put("/reject/:id", protectedRoute, (req, res) => {
    try {
        validateId(req.params.id)
        
        //Comprobar que el usuario logueado tiene rol validator
        if (req.decoded.rol !== "validator") {
            return res.status(401).send({ msg: "You do not have permission for reject an order"})
        }

        Order.findById(req.params.id, function (err, orders){
            if (err) throw err;
            if (!orders) {
                return res.status(400).send({ msg: "This order_id dose not exist."})
            }

            Order.updateOne({ _id : req.params.id}, {$set: {status: "rejected"} }, function(err, result) {
                if (err) throw err;
                res.status(200).send({ msg:"Order rejected"})
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})
    }
})



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
                res.status(200).send({msg:"Order deleted"});
            })
        })
    } catch (error) {
        res.status(400).send({ msg: error.message})  
    }
})


router.get("/waiting", protectedRoute, (req, res) => {
    
    Order.find({status : "waiting"}, function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "There is not order pending to validate"})
        }
        res.status(200).send(orders)
    })
})


router.get("/validated", protectedRoute, (req, res) => {

    Order.find({status : "validated"}, function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "There is not validated order"})
        }
        res.status(200).send(orders)
    })
})


router.get("/recived", protectedRoute, (req, res) => {

    Order.find({status : "recived"}, function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "There is not recived order"})
        }
        res.status(200).send(orders)
    })
})

router.get("/rejected", protectedRoute, (req, res) => {

    Order.find({status : "rejected"}, function (err, orders){
        if (err) res.status(400).send({ msg: err.message})
        if (orders.length == 0) {
            return res.status(200).send({ msg: "There is not rejected order"})
        }
        res.status(200).send(orders)
    })
})



module.exports = router