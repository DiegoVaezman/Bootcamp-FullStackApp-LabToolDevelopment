//const { Schema } = require("mongoose")
const Schema = require("mongoose").Schema;
const validator = require("validator");
const model = require("mongoose").model;


const user = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error("email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    rol: {
        type: String,
        require: true,
        enum:['user','validator']
    }
})


module.exports = User = model("User", user);