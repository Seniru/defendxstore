const mongoose = require("mongoose")
const { getRoles } = require("../utils/getRoles")

const ordersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        minLength: 10,
    },

    orderdate: {
        type: date,
        required: true,
        unique: [true],
    },
    status: {
        type: String,
        enum: ["pending on the way, delivered"],
        required: true,
        minlength: 6,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Item",

    },
    Price: {
        type: Number,
        required: true,
    },
})

const Order = mongoose.model("Order", ordersSchema)
module.exports = Order
