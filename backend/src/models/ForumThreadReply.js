const mongoose = require("mongoose");

const ForumThreadReplySchema = new mongoose.Schema ( {
    threadId: {
        type: String,
        ref: "ForumThread",
        required: true

    },

    content: {
        type: String,
        required: true,
        minlength:5,
        maxlength:500
    },

    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdUser: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    }
});

const ForumThreadReply = mongoose.model("ForumThreadReply", ForumThreadReplySchema)

module.exports = ForumThreadReply