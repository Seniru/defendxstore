const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
    },

    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
    },

    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1024,
    },

    ticketstatus: {
        type: String,
        enum: ["open", "closed"],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

const Ticket = mongoose.model("Ticket", TicketSchema)

module.exports = Ticket
