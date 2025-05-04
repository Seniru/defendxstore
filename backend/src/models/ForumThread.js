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
        maxlength: 2048,
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
        maxlength: 20,
    },

    createdUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ForumThreadReply",
        default: []
    }
})
const ForumThread = mongoose.model("ForumThread", ForumThreadSchema)

module.exports = ForumThread
