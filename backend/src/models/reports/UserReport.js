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

const UserReport = mongoose.model("UserReport", UserReportSchema)

module.exports = UserReport
