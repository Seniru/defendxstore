const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        minlength: 1,
        maxlengt: 30,
    },

    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
    },

    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 100,
    },

    ticketstatus: {
        type: String,
        enum: ["open", "closed"],
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
})

const Ticket = mongoose.model("Ticket", TicketSchema)

module.exports = Ticket
