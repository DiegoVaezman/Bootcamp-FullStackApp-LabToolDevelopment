const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const order = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "Product"
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        trim: true,
        require: true,
        ref: "User"
    },
    status: {
        type: String,  
        enum:['waiting','validated', 'recived', 'rejected'],
        require: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        trim: true,
        require: true,
        ref: "Comment"
    }],
    date: {
        type: Date,
        required: true
    }
})


module.exports = Order = model("Order", order);