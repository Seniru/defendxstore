const mongoose = require("mongoose")

const SupplySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    orderedQuantity: {
        type: Number,
        required: true,
    },
    estimatedCost: {
        type: Number,
        required: true,
    },
    estimatedSellingPrice: {
        type: Number,
        required: true,
    },
    estimatedProfit: {
        type: Number,
        required: true,
    },
})

const Supply = mongoose.model("Supply", SupplySchema)

module.exports = Supply
