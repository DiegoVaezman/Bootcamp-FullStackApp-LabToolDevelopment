const Router = require("express").Router
const Product = require("../models/product")


const router = new Router()



router.get("/", (req, res) => {

    Product.find({})
    .then(product => res.send(product))
})



router.post("/newproduct", (req, res) => {

    const catalog_number = req.body.catalog_number    
    const name = req.body.name
    const type = req.body.type
    const trading_house = req.body.trading_house
    const reference_number = req.body.reference_number
    const price = req.body.price
    const information = req.body.information

    if (!name || !type || !price || !catalog_number) {
        return res.status(400).send({ msg: "Name, type, catalog_number and price is required"})
    }

    Product.find({catalog_number : catalog_number}).then( product => {
        if (product.length > 0) {
            return res.status(208).send({ msg: "The product is already in Products collection"})
        }
        else {

            //Crea el producto y lo guarda en la collección de productos
            const product = new Product({
                catalog_number : catalog_number,
                name : name,
                type : type,
                trading_house : trading_house,
                reference_number : reference_number,
                price : price,
                information : information
            })
        
            product.save()
            .then(doc => res.send(doc)) 
            .catch(error => console.log(error))
            console.log("New product added in Product collection")
        }
    })
})




router.delete("/deleteproduct/:id", (req, res) => {

    //elimina el producto de la coleccion de cproducto
    Product.deleteOne({ _id : req.params.id}, function (err, result){
        if (err) throw err;
        res.send((result.deletedCount === 1) ? {msg:"success"} : {msg:"error"});
        console.log("Deleted product in products collection")
    })

})


module.exports = router