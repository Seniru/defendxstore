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
            createdDate,
            editedDate,
            category,
            createdUser,
            date: Date.now(),
            username: user.username,
        })
        await thread.save()
        return createResponse(res, StatusCodes.CREATED, "Created")
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
        const user = req.user
        console.log(user)

        const { id } = req.params
        const thread = await ForumThread.find({ id }).exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        return createResponse(res, StatusCodes.OK, thread)
    } catch (error) {
        next(error)
    }
}

const editThread = async (req, res, next) => {
    try {
        const user = req.user
        console.log(user)
        const { id } = req.params
        const thread = await ForumThread.findOneAndUpdate(
            { _id: id },
            { title, content, category },
        ).exec()
        if (!thread) return createResponse(res, StatusCodes.NOT_FOUND, "Thread not found")
        return createResponse(res, StatusCodes.OK, "Thread deleted")
    } catch (error) {
        next(error)
    }
}

const deleteThread = async (req, res, next) => {
    try {
        const user = req.user
        console.log(user)

        const forumThread = await ForumThread.findOneAndDelete({ _id: id }).exec()
        if (!forumThread) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, "FOrumThread deleted")
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
