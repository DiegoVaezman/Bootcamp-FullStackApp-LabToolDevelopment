const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
// const ObjectId = Schema.Types.ObjectId



const comment = new Schema({
    owner: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = Comment = model("Comment", comment);