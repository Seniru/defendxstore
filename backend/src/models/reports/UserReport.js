const mongoose = require("mongoose")

const UserReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
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

UserReportSchema.statics.actions = {
    addRole: "add-role",
    removeRole: "remove-role",
    editProfile: "edit-profile",
    createAccount: "create-account",
    referral: "referral",
    deleteAccount: "delete-account",
    changePassword: "change-password",
    changeProfileImage: "change-profile-image",
    verify: "verify",
    login: "login",
}

const UserReport = mongoose.model("UserReport", UserReportSchema)

module.exports = UserReport
