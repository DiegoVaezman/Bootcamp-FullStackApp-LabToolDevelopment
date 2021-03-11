const Router = require("express").Router
const Stock = require("../models/stock")


const router = new Router()



router.get("/", (req, res) => {

    Stock.find({})
    .then(stock => {
        if (stock.length == 0) {
            return res.send({msg: "There are no items"})
        }
        res.send(stock)})
})



router.post("/newitem/:id", (req, res) => {



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


            //Actualiza el status del order a recived
            Order.updateOne({_id : req.params.id}, {$set: {status : "recived"} }, function(err, result) {
                if (err) {
                    console.log(err)
                };
                console.log(`Order status modified to "recived"`)
            })


            //si existen más pedidos de ese producto -> ordered se mantiene en true
            Order.find({ $and: [{product: order[0].product}, {status : { $in: ["validated", "waiting"] }}] }).then(ordersfound => {
                console.log(ordersfound)
                if (ordersfound.length > 1) {
                    ordered = true
                }

                //si el producto existe en stock, lo actualiza
                Stock.find({product : product}).then(item => {
                    if (item.length > 0) {

                        const totalAmount = Number(item[0].amount) + Number(amount)

                    
                        Stock.updateOne({ product : product}, {$set: {amount: totalAmount, status: "in stock", recived: Date.now(), ordered: ordered} }, function(err, result) {
                            if (err) {
                                console.log(err)
                                return res.send({ msg: "An error ocurred updating item"})
                            };
                            console.log(`Item modified in Stock collection`)
                            return res.send({ msg: "The Item is already in stock and was updated in Stock collection"})
                        })
                    }

                    //si no existe el producto en stock, crea el item y lo guarda en la colleción de Stocks
                    else {
         
                        const item = new Stock({
                            product : product,    
                            amount : amount,
                            storage : storage,
                            limit : limit,
                            status : status,
                            ordered : ordered,
                            recived : recived
                        })
                        
                        item.save()
                        .then(doc => res.send(doc)) 
                        .catch(error => console.log(error))
                        console.log("New item added in Stock collection")
                        
                    }
                })
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
        else if (item[0].amount == 0) {
            return res.send({msg: "There is no item to reduce"})
            }
        else {
            const amount = Number(item[0].amount) - 1

            //si la cantidad llega a 0, se cambia el status del item a "out of stock"
            let status = item[0].status
            if (amount == 0) {
                status = "Out of stock"
            }

            Stock.updateOne({ _id : req.params.id}, {$set: {amount: amount, status : status} }, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.send({ msg: "An error ocurred reducing the amount."})
                };
                res.send({ msg:"Success"})
                console.log("Item amount modified")
            })


           //-----------------------------AQUÍ VA EL LÍMITE. --------------------------------- 
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
        res.send({msg: "success"})
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