const mongoose = require("mongoose")
const PromocodeSchema = mongoose.Schema
({
    promocode: {
        type: String,
        required: true,
        minlength:3,
        maxlength:20
    },
    validuntil: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    
})

module.exports = mongoose.model("Promocode", PromocodeSchema)