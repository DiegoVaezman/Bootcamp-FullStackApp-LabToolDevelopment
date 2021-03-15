const Router = require("express").Router
const Order = require("../models/order")
const Product = require("../models/product")
const protectedRoute = require("../middlewares/protectedRoute")

const router = new Router()



router.get("/", (req, res) => {

    Order.find({})
    .then(order => {
        if (order.length == 0) {
            return res.send({msg: "There are no orders"})
        }
        res.send(order)})
    .catch(error => console.log(error))
})



router.post("/neworder/:id", protectedRoute, (req, res) => {

    
    const product = req.params.id
    const amount = req.body.amount      //se requiere por formulario
    const user = req.decoded.id    // usuario logueado
    const status = "waiting"        //cambiará cuando se valide y cuando llegue.



//buscar el id en producto, si no existe el producto mensaje de q no está ese producto
    if (!amount || !user) {
        return res.status(400).send({ msg: "Amount and claimant are required"})
    }
    
    Product.findById(req.params.id).then(products => {
        if (!products) {
            console.log(`This product_Id dose not exist.`)
            return res.status(204).send({ msg: "This product_Id dose not exist."})
        }
    
        
        //actualiza el estado del item a "request"
        Stock.updateOne({ product : product}, {$set: {request: true} }, function(err, result) {
            if (err) {
                console.log(err)
                return res.send({ msg: "An error ocurred updating request status to true"})
            };
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
        .then(doc => res.send(doc)) 
        .catch(error => console.log(error))
        console.log("New order added in Orders collection")
    
    })
})


router.put("/validate/:id", protectedRoute, (req, res) => {

    //Comprobar que el usuario logueado tiene rol validator
    if (req.decoded.rol !== "validator") {
        return res.status(401).send({ msg: "You do not have permission for validate an order"})
    }

    Order.findById(req.params.id).then(orders => {
        if (!orders) {
            console.log(`This order_id dose not exist.`)
            return res.status(204).send({ msg: "This order_id dose not exist."})
        }

        Order.updateOne({ _id : req.params.id}, {$set: {status: "validated"} }, function(err, result) {
            if (err) {
                console.log(err)
                return res.send({ msg: "An error ocurred validating the order."})
            };
            res.send({ msg:"Order validated"})
        })
    })
})


//RECHAZAR UN ORDER
router.put("/reject/:id", protectedRoute, (req, res) => {

    //Comprobar que el usuario logueado tiene rol validator
    if (req.decoded.rol !== "validator") {
        return res.status(401).send({ msg: "You do not have permission for reject an order"})
    }

    Order.findById(req.params.id).then(orders => {
        if (!orders) {
            console.log(`This order_id dose not exist.`)
            return res.status(204).send({ msg: "This order_id dose not exist."})
        }

        Order.updateOne({ _id : req.params.id}, {$set: {status: "rejected"} }, function(err, result) {
            if (err) {
                console.log(err)
                return res.send({ msg: "An error ocurred rejecting the order."})
            };
            res.send({ msg:"Order rejected"})
        })
    })
})



router.delete("/deleteorder/:id", (req, res) => {

    //elimina el producto de la coleccion de cproducto
    Order.deleteOne({ _id : req.params.id}, function (err, result){
        if (err) throw err;
        res.send((result.deletedCount === 1) ? {msg:"success"} : {msg:"error"});
        console.log("Deleted order in Stock collection")
    })
    
})


router.get("/waiting", (req, res) => {
    
    Order.find({status : "waiting"})
    .then(orders => {
        if (orders.length == 0) {
            return res.send({ msg: "There is not order pending to validate"})
        }
        res.send(orders)
    })
    .catch(error => console.log(error))
})


router.get("/validated", (req, res) => {

    Order.find({status : "validated"})
    .then(orders => {
        if (orders.length == 0) {
            return res.send({ msg: "There is not validated order"})
        }
        res.send(orders)
    })
    .catch(error => console.log(error))
})


router.get("/recived", (req, res) => {

    Order.find({status : "recived"})
    .then(orders => {
        if (orders.length == 0) {
            return res.send({ msg: "There is not recived order"})
        }
            res.send(orders)
    })
    .catch(error => console.log(error))
})

router.get("/rejected", (req, res) => {

    Order.find({status : "rejected"})
    .then(orders => {
        if (orders.length == 0) {
            return res.send({ msg: "There is not rejected order"})
        }
            res.send(orders)
    })
    .catch(error => console.log(error))
})



module.exports = router