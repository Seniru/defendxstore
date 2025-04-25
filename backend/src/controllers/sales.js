const { StatusCodes } = require("http-status-codes")
const Order = require("../models/Order")
const createResponse = require("../utils/createResponse")

const getSales = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
        const metric = req.query.metric
        const period = req.query.period || "7d" // defaults to weekly
        let frequency = null

        if (metric && !["expenses", "sales", "revenue", "expected_sales"].includes(metric))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid metric")

        const periodMatch = period.match(/^(\d+)([dmy])$/)
        if (!periodMatch) {
            if (["daily", "weekly", "monthly", "yearly"].includes(period)) {
                frequency = { daily: 1, weekly: 7, monthly: 30, yearly: 365 }[period]
            } else return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid period")
        } else {
            const periodFrequency = periodMatch[1]
            const periodType = periodMatch[2]
            if (!periodFrequency || !periodType)
                return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid period")
            if (periodType != "d" && periodType != "m" && periodType != "y")
                return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid period")

            frequency = parseInt(periodFrequency) * { d: 1, m: 30, y: 365 }[periodType]
        }

        const orders = await Order.find({ status: "delivered" }).sort({ orderdate: 1 }).exec()

        let date = []
        let revenueData = []
        let costData = []
        let expectedSalesData = []
        let profitData = []
        let currentRevenueData = []
        let currentCostData = []
        let currentExpectedSalesData = []
        let currentProfitData = []

        let currentDate = new Date(orders[0].orderdate)
        currentDate.setHours(0, 0, 0, 0)

        let upperBound = new Date(currentDate.getTime() + frequency * 1000 * 60 * 60 * 24)
        date.push(new Date(currentDate))

        let index = 0

        while (index < orders.length) {
            let order = orders[index]
            let orderDate = new Date(order.orderdate)
            orderDate.setHours(0, 0, 0, 0)

            if (orderDate.getTime() < upperBound.getTime()) {
                currentRevenueData.push(order.price)
                currentProfitData.push(0)
                currentCostData.push(0)
                // currentExpectedSalesData.push(0)
                index++
            } else {
                revenueData.push(currentRevenueData.reduce((t, v) => t + v, 0))
                profitData.push(currentProfitData.reduce((t, v) => t + v, 0))
                costData.push(currentCostData.reduce((t, v) => t + v, 0))
                // expectedSalesData.push(currentExpectedSalesData.reduce((t, v) => t + v, 0))
                currentRevenueData = []
                currentProfitData = []
                currentCostData = []
                // currentExpectedSalesData = []

                currentDate = new Date(currentDate.getTime() + frequency * 1000 * 60 * 60 * 24)
                upperBound = new Date(currentDate.getTime() + frequency * 1000 * 60 * 60 * 24)
                date.push(new Date(currentDate))
            }
        }

        revenueData.push(currentRevenueData.reduce((t, v) => t + v, 0))
        profitData.push(currentProfitData.reduce((t, v) => t + v, 0))
        costData.push(currentCostData.reduce((t, v) => t + v, 0))
        //expectedSalesData.push(currentExpectedSalesData.reduce((t, v) => t + v, 0))
        // set the mean of sales to the expected sales
        let avg = revenueData.reduce((t, v) => t + v, 0) / revenueData.length
        expectedSalesData = Array.from({ length: revenueData.length }, () => avg)

        return createResponse(res, StatusCodes.OK, [
            date,
            { revenueData, profitData, costData, expectedSalesData },
        ])
    } catch (error) {
        next(error)
    }
}

module.exports = { getSales }
