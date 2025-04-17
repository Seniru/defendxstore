require("dotenv").config()
const mongoose = require("mongoose")
const perkList = require("../controllers/perks/list")
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
    referredBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    referrals: {
        type: [
            {
                user: { type: mongoose.Types.ObjectId, ref: "User" },
            },
        ],
    },
    perks: {
        type: Map,
        of: new mongoose.Schema({
            progress: { type: Number, default: 0 },
            claimed: { type: Boolean, deafault: false },
        }),
        default: {},
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
    const user = await this.constructor.findByIdAndUpdate(
        this._id,
        {
            $push: {
                notifications: {
                    $each: [{ message: notification }],
                    $position: 0,
                },
            },
        },
        { new: true },
    )
    Object.assign(this, user.toObject())
}

UserSchema.methods.incrementProgress = async function (perk) {
    const currentProgress = this.perks.get(perk)?.progress || 0
    const maxProgress = perkList[perk].maxProgress

    // Only increment if not already completed
    if (currentProgress < maxProgress) {
        const user = await this.model("User").findByIdAndUpdate(
            this._id,
            {
                $inc: {
                    [`perks.${perk}.progress`]: 1,
                },
            },
            { new: true },
        )
        Object.assign(this, user.toObject())
    }
}

const User = mongoose.model("User", UserSchema)

module.exports = User
