const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
// const ObjectId = Schema.Types.ObjectId



const comment = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "Order"
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = Comment = model("Comment", comment);