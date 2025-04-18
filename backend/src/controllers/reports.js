const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const UserReport = require("../models/reports/UserReport")

const types = {
    users: UserReport,
}

const getReport = async (req, res, next) => {
    try {
        const { type } = req.params
        const model = types[type]
        if (!model) return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid report type")
        const report = await model.find({}).exec()
        return createResponse(res, StatusCodes.OK, { type, report })
    } catch (error) {
        next(error)
    }
}

module.exports = { getReport }
