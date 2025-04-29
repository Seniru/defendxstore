const mongoose = require("mongoose")

const OrderReportScehma = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    data: {
        type: Object,
    },
})

OrderReportScehma.statics.actions = {
    createOrder: "create-order",
    deleteOrder: "delete-order",
    acquireDelivery: "acquire-delivery",
    updateOrderStatus: "update-order",
}

const OrderReport = mongoose.model("OrderReport", OrderReportScehma)

module.exports = OrderReport
