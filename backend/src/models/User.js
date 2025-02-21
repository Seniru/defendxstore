const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
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
        type: Array[String],
    },
    profileImage: {
        type: String,
    },
    role: {
        type: Number,
    },
})

const User = mongoose.model("User", UserSchema)

module.exports = User
