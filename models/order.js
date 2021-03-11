const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const order = new Schema({
    product: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    claimant: {
        type: String,
        trim: true,
        require: true
    },
    status: {
        type: String,  
        enum:['waiting','validated', 'recived'],
        require: true
    },
    date: {
        type: Date,
        required: true
    }
})


module.exports = Order = model("Order", order);