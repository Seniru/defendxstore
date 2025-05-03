const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
})

const Expense = mongoose.model("Expense", ExpenseSchema)
module.exports = Expense
