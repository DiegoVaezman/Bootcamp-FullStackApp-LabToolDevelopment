const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const stock = new Schema({
    product: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        minimum: 0
    },
    storage: {
        type: String,
        trim: true,
    },
    control: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number
    },
    automaticamount: {
        type: Number
    },
    status: {
        type: String,  
        enum: ["In stock", "Out of stock"]
    },
    request: {
        type: Boolean
    },
    recived: {
        type: Date,
        required: true
    }
})


module.exports = Stock = model("Stock", stock);