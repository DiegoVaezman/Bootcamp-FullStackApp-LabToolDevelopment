require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors")
const path = require("path")

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL



mongoose.connect(MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}) //devuelve una promise
.then( () => {

    app.use(express.urlencoded())  //realmente es necesario????
    app.use(express.json())
    app.use(cors())
    app.use(express.static(path.join(__dirname, "client", "build")))

    const userRouter = require("./routes/userRouter")
    const commentRouter = require("./routes/commentRouter")
    const productRouter = require("./routes/productRouter")
    const stockRouter = require("./routes/stockRouter")
    const orderRouter = require("./routes/orderRouter")
    const loginRouter = require("./routes/loginRouter")
    app.use("/user", userRouter)
    app.use("/comment", commentRouter)
    app.use("/product", productRouter)
    app.use("/stock", stockRouter)
    app.use("/order", orderRouter)
    app.use("/login", loginRouter)

    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
    
    app.listen(PORT, () => 
    console.log(`Server running on port:${PORT}`));

})

.catch((error) => {
    console.log(error)

    if(mongoose.connection.readyState === 1)
    return mongoose.disconnect()
    .catch(console.error)
    .then(() => process.exit())
})