const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const createResponse = require("../utils/createResponse")

const getNotifications = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        const notifications = user.notifications
        return createResponse(res, StatusCodes.OK, {
            notifications,
            notificationCount: notifications.length,
        })
    } catch (error) {
        next(error)
    }
}

const deleteAllNotifications = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.user.username },
            { notifications: [] },
        ).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, "Cleared all notifications")
    } catch (error) {
        next(error)
    }
}

const deleteNotification = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10)
        if (isNaN(id) || id < 0)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Notification id must be a non-negative integer",
            )
        const user = await User.findOne({ username: req.user.username }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        if (id >= user.notifications.length)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Notification id is more than the notifications list",
            )
        user.notifications.splice(id, 1)
        await user.save()
        return createResponse(res, StatusCodes.OK, "Notification removed")
    } catch (error) {
        next(error)
    }
}

module.exports = { getNotifications, deleteAllNotifications, deleteNotification }
