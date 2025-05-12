const mongoose = require("mongoose")
const PromocodeSchema = new mongoose.Schema({
    promocode: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    validuntil: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    createdFor: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
})

PromocodeSchema.statics.generateRandomCode = async function (validuntil, discount, createdFor) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const length = 5

    let promocode
    let exists = true

    while (exists) {
        promocode = Array.from({ length }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length)),
        ).join("")
        exists = await this.exists({ promocode })
    }

    return this.create({
        promocode,
        validuntil,
        discount,
        createdFor,
    })
}

const PromoCode = mongoose.model("Promocode", PromocodeSchema)
module.exports = PromoCode
