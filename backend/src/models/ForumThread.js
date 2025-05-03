const mongoose = require("mongoose")

const ForumThreadSchema = new mongoose.Schema({
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

    createdDate: {
        type: Date,
        required: true,
    },

    editedDate: {
        type: Date,
    },

    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlenght: 20,
    },

    createdUser: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 10,
    },
})
const ForumThread = mongoose.model("ForumThread", ForumThreadSchema)

module.exports = ForumThread
