const mongoose = require("mongoose")
const Schema = mongoose.Schema
const item = new Schema({
    product: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    colors: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("Item", item)
