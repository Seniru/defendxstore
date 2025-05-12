const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const ForumThread = require("../models/ForumThread")
const ForumThreadReply = require("../models/ForumThreadReply")
const User = require("../models/User")

const createThread = async (req, res, next) => {
    try {
        const { title, content, category } = req.body

        if (!title || !content || !category)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Missing title, content or category",
            )

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

        await user.incrementProgress("forumNewbie")
        await user.incrementProgress("threadMaster")

        return createResponse(res, StatusCodes.CREATED, thread)
    } catch (error) {
        if (error.name === "ValidationError")
            return createResponse(res, StatusCodes.BAD_REQUEST, error.message)
        next(error)
    }
}

const getAllThreads = async (req, res, next) => {
    try {
        const { q, category } = req.query

        const query = { title: { $regex: q || "", $options: "i" } }
        if (category) query.category = category

        const forums = await ForumThread.find(query)
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
                populate: { path: "createdUser", select: "username" },
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
        if (!title || !content || !category)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Missing title, content or category",
            )

        const user = await User.findOne({ username: req.user.username }).exec()
        const thread = await ForumThread.findById(threadId).exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        if (thread.createdUser.toString() != user._id.toString())
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not allowed to edit this thread",
            )

        await ForumThread.findOneAndUpdate(
            { _id: threadId },
            { title, content, category, editedDate: Date.now() },
            { new: true, runValidators: true },
        ).exec()

        return createResponse(res, StatusCodes.OK, "Thread updated")
    } catch (error) {
        if (error.name === "ValidationError")
            return createResponse(res, StatusCodes.BAD_REQUEST, error.message)
        next(error)
    }
}

const deleteThread = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const user = await User.findOne({ username: req.user.username }).exec()
        const thread = await ForumThread.findById(threadId).exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        if (thread.createdUser.toString() != user._id.toString())
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not allowed to delete this thread",
            )

        await ForumThread.findOneAndDelete({ _id: threadId }).exec()
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

        const thread = await ForumThread.findByIdAndUpdate(
            threadId,
            {
                $push: { replies: reply._id },
            },
            { runValidators: true },
        ).exec()

        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")

        await user.incrementProgress("communityHelper")

        return createResponse(res, StatusCodes.CREATED, reply)
    } catch (error) {
        if (error.name === "ValidationError")
            return createResponse(res, StatusCodes.BAD_REQUEST, error.message)
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
