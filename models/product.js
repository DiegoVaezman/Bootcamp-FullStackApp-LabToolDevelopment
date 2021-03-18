const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const product = new Schema({
    catalog_number: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    trading_house: {
        type: String,
        trim: true,
        lowercase: true,
    },
    reference_number: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    information: {
        type: String,
        trim: true
    }
})


module.exports = Product = model("Product", product);