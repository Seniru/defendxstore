const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const UserReport = require("../models/reports/UserReport")
const OrderReport = require("../models/reports/OrderReport")
const SupportReport = require("../models/reports/SupportReport")

const getUsersReport = async (req, res, next) => {
    try {
        const { action, searchUser } = req.query
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null

        if (action && !Object.values(UserReport.actions).includes(action))
            return createResponse(res, StatusCodes.NOT_FOUND, "Action not found")

        let query = {}
        if (action) query.action = action
        if (fromDate || toDate)
            query.timestamp = {
                $gte: fromDate,
                $lte: toDate,
            }

        let report = await UserReport.find(query)
            .populate({ path: "user", select: "username" })
            .exec()

        // filter users
        if (searchUser) report = report.filter((l) => l.user.username.match(searchUser))

        return createResponse(res, StatusCodes.OK, {
            report,
            actions: Object.values(UserReport.actions),
        })
    } catch (error) {
        next(error)
    }
}

const getOrdersReport = async (req, res, next) => {
    try {
        const { action, searchUser } = req.query
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null

        if (action && !Object.values(OrderReport.actions).includes(action))
            return createResponse(res, StatusCodes.NOT_FOUND, "Action not found")

        let query = {}
        if (action) query.action = action
        if (fromDate || toDate) {
            query.timestamp = {}
            if (fromDate) query.timestamp.$gte = fromDate
            if (toDate) query.timestamp.$lte = toDate
        }

        let report = await OrderReport.find(query)
            .populate({ path: "user", select: "username" })
            .exec()

        // filter users
        if (searchUser) report = report.filter((l) => l.user.username.match(searchUser))

        return createResponse(res, StatusCodes.OK, {
            report,
            actions: Object.values(OrderReport.actions),
        })
    } catch (error) {
        next(error)
    }
}

const getSupportReport = async (req, res, next) => {
    try {
        const { action, searchUser } = req.query
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null

        if (action && !Object.values(SupportReport.actions).includes(action))
            return createResponse(res, StatusCodes.NOT_FOUND, "Action not found")

        let query = {}
        if (action) query.action = action
        if (fromDate || toDate) {
            query.timestamp = {}
            if (fromDate) query.timestamp.$gte = fromDate
            if (toDate) query.timestamp.$lte = toDate
        }

        let report = await SupportReport.find(query)
            .populate({ path: "user", select: "username" })
            .exec()

        // filter users
        if (searchUser) report = report.filter((l) => l.user.username.match(searchUser))

        return createResponse(res, StatusCodes.OK, {
            report,
            actions: Object.values(SupportReport.actions),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getUsersReport, getOrdersReport, getSupportReport }
