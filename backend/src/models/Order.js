const mongoose = require("mongoose")

const ordersSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    deliveryAddress: {
        type: String,
        minLength: 10,
    },
    orderdate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "on the way", "delivered"],
        required: true,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Item",
    },
    price: {
        type: Number,
        required: true,
    },
})

const Order = mongoose.model("Order", ordersSchema)
module.exports = Order
