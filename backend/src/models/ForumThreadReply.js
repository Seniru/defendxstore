const mongoose = require("mongoose")

const ForumThreadReplySchema = new mongoose.Schema({
    threadId: {
        type: String,
        ref: "ForumThread",
        required: true,
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
        default: Date.now,
    },
    createdUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

const ForumThreadReply = mongoose.model("ForumThreadReply", ForumThreadReplySchema)

module.exports = ForumThreadReply
