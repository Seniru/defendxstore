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
})

UserSchema.methods.applyDerivations = function () {
    let user = this.toObject()
    user.role = getRoles(this.role)
    if (this.profileImage) user.profileImage = encodeURI(this.profileImage)
    return user
}

const User = mongoose.model("User", UserSchema)

module.exports = User
