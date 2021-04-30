const Schema = require("mongoose").Schema;
const model = require("mongoose").model;


const userCount = new Schema({
    user: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    }
})


module.exports = UserCount = model("UserCount", userCount);