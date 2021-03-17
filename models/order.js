const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const order = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "product"
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    user: {
        type: String,
        trim: true,
        require: true
    },
    status: {
        type: String,  
        enum:['waiting','validated', 'recived', 'rejected'],
        require: true
    },
    date: {
        type: Date,
        required: true
    }
})


module.exports = Order = model("Order", order);