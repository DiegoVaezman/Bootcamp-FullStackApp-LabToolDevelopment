const Router = require("express").Router
const Stock = require("../models/stock")


const router = new Router()



router.get("/", (req, res) => {

    Stock.find({})
    .then(stock => res.send(stock))
})



router.post("/newitem/:id", (req, res) => {


    //mirar que el pedido esté en status recived
    //mirar que el id sea de un pedido

    Order.find({_id : req.params.id}).then(order => {
        if (order.length == 0) {
            console.log(`This order_Id dose not exist.`)
            return res.status(204).send({ msg: "This order_Id dose not exist."})   //204 no content
        }
        else if (order[0].status !== "validated") {
            console.log(`The status order is not "validated"`)
            return res.status(405).send({ msg: 'The status order is not "validated"'})  //405 Method Not Allowed
        }
        else {
            const product = order[0].product        //sera el id del producto dentro del pedido q se busca con la ruta id
            const amount = order[0].amount    //sera la que aparece en el pedido
            const storage = req.body.storage   //nuevo campo de formulario
            const limit = req.body.limit         //nuevo campo d formulario   
            const status = "in stock"        //hay q pensarlo...
            let ordered = false   
            const recived = Date.now()            //se queda asi


            Stock.find({product : product}).then(item => {
                console.log(item)
                if (item.length > 0) {

                    const totalAmount = Number(item[0].amount) + Number(amount)

                    Order.find({product: order[0].product}).then(ordersfound => {
                        if (ordersfound.length > 1) {
                            ordered = true
                        }

                        Stock.updateOne({ product : product}, {$set: {amount: totalAmount, status: "in stock", recived: Date.now(), ordered: ordered} }, function(err, result) {
                            if (err) {
                                console.log(err)
                                return res.send({ msg: "An error ocurred updating item"})
                            };
                            console.log(`Item modified in Stock collection`)
                            return res.send({ msg: "The Item is already in stock and was updated in Stock collection"})
                        })
                    })
                    .catch(error => console.log(error))


                    //Actualiza el status del order a recived
                    Order.updateOne({_id : req.params.id}, {$set: {status : "recived"} }, function(err, result) {
                        if (err) {
                            console.log(err)
                        };
                        console.log(`Order status modified to "recived"`)
                    })
                    
                }
                else {

                    Order.find({ $and: [{product: order[0].product}, {status : { $in: ["recived", "waiting"] }}] }).then(ordersfound => {
                        console.log(ordersfound)
                        if (ordersfound.length > 1) {
                            ordered = true
                        }

                        //Crea el item y lo guarda en la collección de Stock          
                        const item = new Stock({
                            product : product,    
                            amount : amount,
                            storage : storage,
                            limit : limit,
                            status : status,
                            ordered : ordered,
                            recived : recived
                        })
                        
                        //Actualiza el status del order a recived
                        Order.updateOne({_id : req.params.id}, {$set: {status : "recived"} }, function(err, result) {
                            if (err) {
                                console.log(err)
                            };
                            console.log(`Order status modified to "recived"`)
                        })


                        item.save()
                        .then(doc => res.send(doc)) 
                        .catch(error => console.log(error))
                        console.log("New item added in Stock collection")
                    })
                }
            })   
        }
        
    })
})


router.put("/reduce/:id", (req, res) => {

    Stock.find({_id : req.params.id}).then(item => {
        if (item[0].length == 0) {
            console.log(`This itme_id dose not exist.`)
            return res.status(204).send({ msg: "This item_id dose not exist."})
        }
        else {
            const amount = Number(item[0].amount) - 1
            Stock.updateOne({ _id : req.params.id}, {$set: {amount: amount} }, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ msg: "An error ocurred reducing the amount."})
                };
                res.send({ msg:"Success"})
            })
        }
    })
    .catch(error => console.log(error))
})



router.put("/:id/modify", (req, res) => {
    const amount = req.body.amount
    const storage = req.body.storage
    const limit = req.body.limit
    const control = req.body.control

    Stock.updateOne({ _id : req.params.id}, {$set: {amount : amount, storage : storage, limit : limit, control : control} }, function(err, result) {
        if (err) throw err;
        res.send(result)
        console.log(`Item ${req.params.id} modified on Stock collection`)
    })
})





router.delete("/deleteitem/:id", (req, res) => {

    //elimina el producto de la coleccion de cproducto
    Stock.deleteOne({ _id : req.params.id}, function (err, result){
        if (err) throw err;
        res.send((result.deletedCount === 1) ? {msg:"success"} : {msg:"error"});
        console.log("Deleted item in Stock collection")
    })

})


module.exports = router