const mongoose = require("mongoose");
const User = require("./User");
const Comment = require("./Comment");
require("dotenv").config();


MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
.then( () => {
    const user = new User({
        fullname: "Diego Vaezman",
        email: "diego@vaezman.com",
        password: "123456789",
        position: "boss"
    });

    const comment = new Comment({
        fullname: "Diego",
        owner: user.id,
        text: "Este es un comentario que hago!! que bien!!!"
    });


    return Promise.all([user.save(), comment.save()]);

})
.catch((error) => console.log(error))
.then(() => mongoose.disconnect())
.then (() => console.log("Disconnected"))