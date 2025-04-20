const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const UserReport = require("../models/reports/UserReport")

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

module.exports = { getUsersReport }
