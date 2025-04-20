const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const UserReport = require("../models/reports/UserReport")

const getUsersReport = async (req, res, next) => {
    try {
        const report = await UserReport.find({})
            .populate({ path: "user", select: "username" })
            .exec()
        return createResponse(res, StatusCodes.OK, {
            report,
            actions: Object.values(UserReport.actions),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getUsersReport }
