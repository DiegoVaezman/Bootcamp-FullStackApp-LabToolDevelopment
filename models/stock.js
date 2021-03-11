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
        trim: true
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
        type: Number,
        trim: true,
    },
    status: {
        type: String,  //in stock or in stock and pending to arrived...
        trim: true
    },
    ordered: {
        type: Boolean
    },
    recived: {
        type: Date,
        required: true,
        trim: true
    }
})


module.exports = Stock = model("Stock", stock);