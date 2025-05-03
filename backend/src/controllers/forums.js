const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const ForumThread = require("../models/ForumThread")

const createThread = async (req, res, next) => {
    try {
        const { title, content, category } = req.body
        const user = req.user
        console.log(user)
        const thread = new ForumThread({
            title,
            content,
            createdDate: Date.now(),
            edittedDate: null,
            category,
            createdUser: user.username,
        })
        await thread.save()
        return createResponse(res, StatusCodes.CREATED, thread)
    } catch (error) {
        next(error)
    }
}

const getAllThreads = async (req, res, next) => {
    try {
        const user = req.user
        const forums = await ForumThread.find({}).exec()
        return createResponse(res, StatusCodes.OK, forums)
    } catch (error) {
        next(error)
    }
}

const getThread = async (req, res, next) => {
    try {
        const { threadId } = req.params
        const thread = await ForumThread.findOne({ _id: threadId }).exec()
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

module.exports = {
    createThread,
    getAllThreads,
    getThread,
    editThread,
    deleteThread,
}
