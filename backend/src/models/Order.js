const mongoose = require("mongoose")

const ordersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        enum: ["pending", "on_the_way", "delivered"],
        required: true,
    },
    items: {
        default: [],
        type: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Item",
                },
                color: String,
                size: String,
            },
        ],
    },
    price: {
        type: Number,
        required: true,
    },
    assignedAgent: {
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

const Order = mongoose.model("Order", ordersSchema)
module.exports = Order
