const Router = require("express").Router
const Order = require("../models/order")


const router = new Router()



router.get("/", (req, res) => {

    Order.find({})
    .then(order => res.send(order))
    .catch(error => console.log(error))
})



router.post("/neworder/:id", (req, res) => {

    
    const product = req.params.id
    const amount = req.body.amount      //se requiere por formulario
    const claimant = req.body.claimant    // se debe cambiar por el id del usuario logueado
    const status = "waiting"        //cambiará cuando se valide y cuando llegue.
    const date = Date.now()


//buscar el id en producto, si no existe el producto mensaje de q no está ese producto
    if (!amount || !claimant) {
        return res.status(400).send({ msg: "Amount and claimant is required"})
    }
    
    Product.find({_id : product}).then(products => {
        if (products[0].length == 0) {
            console.log(`This product_Id dose not exist.`)
            return res.status(204).send({ msg: "This product_Id dose not exist."})
        }
    
        else{
            //actualiza el estado del item a "ordered"
            Stock.updateOne({ product : product}, {$set: {ordered: true} }, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ msg: "An error ocurred updating ordered status to true"})
                };
            })
            //Crea el pedido y lo guarda en la collección de Orders
            const order = new Order({
                product :product,
                amount : amount,
                claimant :claimant,
                status : status,
                date : date
            })
        
            order.save()
            .then(doc => res.send(doc)) 
            .catch(error => console.log(error))
            console.log("New order added in Orders collection")
        }
    })
})


router.put("/validate/:id", (req, res) => {

    Order.find({_id : req.params.id}).then(order => {
        if (order[0].length == 0) {
            console.log(`This order_id dose not exist.`)
            return res.status(204).send({ msg: "This order_id dose not exist."})
        }
        else {
            Order.updateOne({ _id : req.params.id}, {$set: {status: "validated"} }, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ msg: "An error ocurred validating the order."})
                };
                res.send({ msg:"Order validated"})
            })
        }
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
    .then(order => {
        if (order.length == 0) {
            return res.send({ msg: "There is not order pending to validate"})
        }
        else {
            res.send(order)
        }
    })
    .catch(error => console.log(error))
})


router.get("/validated", (req, res) => {

    Order.find({status : "validated"})
    .then(order => {
        if (order.length == 0) {
            return res.send({ msg: "There is not validated order"})
        }
        else {
            res.send(order)
        }
    })
    .catch(error => console.log(error))
})


router.get("/recived", (req, res) => {

    Order.find({status : "recived"})
    .then(order => {
        if (order.length == 0) {
            return res.send({ msg: "There is not recived order"})
        }
        else {
            res.send(order)
        }
    })
    .catch(error => console.log(error))
})



module.exports = router