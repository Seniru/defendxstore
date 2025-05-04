const mongoose = require("mongoose")

const SupportReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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

SupportReportSchema.statics.actions = {
    createTicket: "create-ticket",
    editTicket: "edit-ticket",
    deleteTicket: "delete-ticket",
    resolveTicket: "resolve-ticket",
}

const SupportReport = mongoose.model("SupportReport", SupportReportSchema)

module.exports = SupportReport
