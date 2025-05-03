require("dotenv").config()

const { StatusCodes } = require("http-status-codes")
const Order = require("../models/Order")
const Item = require("../models/Item")
const createResponse = require("../utils/createResponse")
const Supply = require("../models/Supply")

// helper function

const validateAndGetQuery = async (res, dateFrom, dateTo, metric, period) => {
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

    const query = { status: "delivered" }
    if (dateFrom || dateTo) {
        query.orderdate = {}
        if (dateFrom) query.orderdate.$gte = dateFrom
        if (dateTo) query.orderdate.$lte = dateTo
    }

    return [query, frequency]
}

const processSales = async (orders, frequency, metric, dateTo, item) => {
    let date = []
    let revenueData = []
    let costData = []
    let expectedSalesData = []
    let profitData = []
    let currentRevenueData = []
    let currentCostData = []
    let currentExpectedSalesData = []
    let currentProfitData = []
    if (orders.length == 0) return [[], []]

    dateTo = (dateTo || orders[orders.length - 1].orderdate).toISOString().split("T")[0]

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
    // let avg = revenueData.reduce((t, v) => t + v, 0) / revenueData.length
    //expectedSalesData = Array.from({ length: revenueData.length }, () => avg)

    const fromDate = orders[0].orderdate.toISOString().split("T")[0]
    const expectedSalesDataResponse = await fetch(
        `${process.env.AI_SERVICES_URI}/predictions/items/?frequency=${frequency}&fromDate=${fromDate}&toDate=${dateTo}` +
            (item ? `&item=${item}` : ""),
    )
    let result = await expectedSalesDataResponse.json()
    expectedSalesData = result.map((data) => data[1])

    let returnData = {}
    returnData = { revenueData, profitData, costData, expectedSalesData }
    if (metric) {
        returnData = {
            expenses: { costData },
            sales: { profitData },
            revenue: { revenueData },
            expected_sales: { expectedSalesData },
        }[metric]
    }

    return [result.length > date.length ? result.map((data) => data[0]) : date, returnData]
}

const getSales = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
        const metric = req.query.metric
        const period = req.query.period || "7d" // defaults to weekly
        const [query, frequency] = await validateAndGetQuery(res, dateFrom, dateTo, metric, period)
        const orders = await Order.find(query).sort({ orderdate: 1 }).exec()
        const processed = await processSales(orders, frequency, metric, dateTo)
        return createResponse(res, StatusCodes.OK, processed)
    } catch (error) {
        next(error)
    }
}

const getMonthlySales = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
        const metric = req.query.metric
        const period = "1m"
        const [query, frequency] = await validateAndGetQuery(res, dateFrom, dateTo, metric, period)
        const orders = await Order.find(query).sort({ orderdate: 1 }).exec()
        const processed = await processSales(orders, frequency, metric, dateTo)
        return createResponse(res, StatusCodes.OK, processed)
    } catch (error) {
        next(error)
    }
}

const compareItems = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
        const metric = req.query.metric
        const period = "7d"

        const itemNames = req.query.items?.split(",")?.filter((item) => item)
        if (!itemNames || itemNames.length == 0)
            return createResponse(res, StatusCodes.BAD_REQUEST, "No items provided")

        const items = await Item.find({ itemName: { $in: itemNames } })
            .distinct("_id")
            .exec()

        const [query, frequency] = await validateAndGetQuery(res, dateFrom, dateTo, metric, period)
        query["items.product"] = {
            $in: items,
        }

        const orders = await Order.find(query)
            .sort({ orderdate: 1 })
            .populate({ path: "items.product", select: "itemName price" })
            .exec()

        let longest = ""
        let statistics = {}
        for (let i in itemNames) {
            let itemName = itemNames[i]
            let item = items[i]

            let filteredOrders = orders.filter((order) =>
                order.items.some((item) => item.product.itemName == itemName),
            )
            statistics[itemName] = await processSales(
                filteredOrders,
                frequency,
                metric,
                dateTo,
                item,
            )
            if (longest == "" || statistics[itemName][0].length > statistics[longest][0].length)
                longest = itemName
        }
        //const processed = await processSales(dateFrom, dateTo, metric, period, items)
        let longestDateRange = statistics[longest][0]
        let data = {}
        for (let key of Object.keys(statistics)) {
            let availableData = Object.keys(statistics[key][1])[0]
            data[key] = statistics[key][1][availableData]
        }
        return createResponse(res, StatusCodes.OK, [longestDateRange, data])
    } catch (error) {
        next(error)
    }
}

const getSupplyMetrics = async (req, res, next) => {
    try {
        const supplies = await Supply.find({}).populate("item").sort({ date: -1 }).exec()
        return createResponse(res, StatusCodes.OK, supplies)
    } catch (error) {
        next(error)
    }
}

module.exports = { getSales, getMonthlySales, compareItems, getSupplyMetrics }
