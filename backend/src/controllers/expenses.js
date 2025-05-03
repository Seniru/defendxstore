const { StatusCodes } = require("http-status-codes")
const Expense = require("../models/Expense")
const createResponse = require("../utils/createResponse")

const getExpenses = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null
        const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null
        const categories = !!req.query.categories

        const query = {}
        if (dateFrom || dateTo) {
            query.date = {}
            if (dateFrom) query.date.$gte = dateFrom
            if (dateTo) query.date.$lte = dateTo
        }

        const expenses = await Expense.find(query).exec()

        if (categories) {
            const categoricalExpenses = {}
            for (let expense of expenses) {
                const category = expense.category
                if (!categoricalExpenses[category]) categoricalExpenses[category] = 0
                categoricalExpenses[category] += expense.amount
            }
            return createResponse(res, StatusCodes.OK, {
                categories: Object.keys(categoricalExpenses),
                expenses: Object.values(categoricalExpenses),
            })
        }
        return createResponse(res, StatusCodes.OK, expenses)
    } catch (error) {
        next(error)
    }
}

const createExpense = async (req, res, next) => {
    try {
        const { category, amount, date, description } = req.body
        if (!category || !amount || !date)
            return createResponse(res, StatusCodes.BAD_REQUEST, "Missing category, amount, or date")
        const expense = new Expense({ category, amount, date, description })
        await expense.save()
        return createResponse(res, StatusCodes.OK, "Expense added")
    } catch (error) {
        next(error)
    }
}

module.exports = { getExpenses, createExpense }
