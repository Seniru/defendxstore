const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const ForumThread = require("../models/ForumThread")
const ForumThreadReply = require("../models/ForumThreadReply")
const User = require("../models/User")

const createThread = async (req, res, next) => {
    try {
        const { title, content, category } = req.body
        const user = await User.findOne({ username: req.user.username }).exec()
        const thread = new ForumThread({
            title,
            content,
            createdDate: Date.now(),
            edittedDate: null,
            category,
            createdUser: user._id,
        })
        await thread.save()
        return createResponse(res, StatusCodes.CREATED, thread)
    } catch (error) {
        next(error)
    }
}

const getAllThreads = async (req, res, next) => {
    try {
        const forums = await ForumThread.find({})
            .populate({ path: "createdUser", select: "username" })
            .exec()
        return createResponse(res, StatusCodes.OK, forums)
    } catch (error) {
        next(error)
    }
}

const getThread = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const thread = await ForumThread.findOne({ _id: threadId })
            .populate({ path: "createdUser", select: "username" })
            .populate({
                path: "replies",
                populate: { path: "createdUser", select: "username" }
              })
                        .exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        return createResponse(res, StatusCodes.OK, thread)
    } catch (error) {
        next(error)
    }
}

const editThread = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const { title, content, category } = req.body
        const thread = await ForumThread.findOneAndUpdate(
            { _id: threadId },
            { title, content, category, editedDate: Date.now() },
        ).exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        return createResponse(res, StatusCodes.OK, "Thread updated")
    } catch (error) {
        next(error)
    }
}

const deleteThread = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const forumThread = await ForumThread.findOneAndDelete({ _id: threadId }).exec()
        if (!forumThread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        return createResponse(res, StatusCodes.OK, "Thread deleted")
    } catch (error) {
        next(error)
    }
}

const createReply = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const { content } = req.body
        if (!content) return createResponse(res, StatusCodes.BAD_REQUEST, "Missing content")

        const user = await User.findOne({ username: req.user.username }).exec()
        const reply = await ForumThreadReply.create({
            threadId,
            content,
            createdDate: Date.now(),
            createdUser: user._id,
        })

        await ForumThread.findByIdAndUpdate(threadId, {
            $push: { replies: reply._id }
        }).exec()

        return createResponse(res, StatusCodes.CREATED, reply)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createThread,
    getAllThreads,
    getThread,
    editThread,
    deleteThread,
    createReply,
}
