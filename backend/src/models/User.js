require("dotenv").config()
const mongoose = require("mongoose")
const { getRoles } = require("../utils/getRoles")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: [true, "Username taken"],
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
        unique: [true, "User already exist with this email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    deliveryAddress: {
        type: String,
        minLength: 10,
    },
    contactNumber: {
        type: [String],
    },
    profileImage: {
        type: String,
        maxlength: [
            2 * 1024 * 1024, // 2MB,
            "Image should be less than 2 MB in size",
        ],
    },
    role: {
        type: Number,
        default: 1,
    },
    cart: {
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
    notifications: {
        default: [],
        type: [
            {
                message: { type: String, required: true },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    referrals: {
        type: [
            {
                user: { type: mongoose.Types.ObjectId, ref: "User" },
            },
        ],
    },
})

UserSchema.methods.applyDerivations = function () {
    let user = this.toObject()
    user.role = getRoles(this.role)
    if (user.verified) user.referralLink = `${process.env.FRONTEND_URL}/auth/signup?ref=${user._id}`
    if (this.profileImage) user.profileImage = encodeURI(this.profileImage)
    return user
}

UserSchema.methods.pushNotification = async function (notification) {
    await this.constructor.findByIdAndUpdate(this._id, {
        $push: {
            notifications: {
                $each: [{ message: notification }],
                $position: 0,
            },
        },
    })
}

const User = mongoose.model("User", UserSchema)

module.exports = User
