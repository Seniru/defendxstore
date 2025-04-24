const { StatusCodes } = require("http-status-codes")
const Order = require("../models/Order")
const createResponse = require("../utils/createResponse")
const User = require("../models/User")

const getMyDeliveries = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        const status = req.query.status
        let query = { assignedAgent: user._id }
        if (status) {
            if (!["pending", "on_the_way", "delivered"].includes(status))
                return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid status")
            query.status = status
        }
        let orders = await Order.find(query).populate("items.product").exec()
        orders = orders.map((order) => {
            const groupedItems = order.items.reduce((acc, item) => {
                const product = item.product
                const key = `${product.itemName}-${item.color}-${item.size}`

                if (!acc[key]) {
                    acc[key] = {
                        ...product.toObject(),
                        color: item.color || null,
                        size: item.size || null,
                        quantity: 0,
                    }
                }

                acc[key].quantity += item.quantity || 1
                return acc
            }, {})

            return {
                ...order.toObject(),
                items: Object.values(groupedItems),
            }
        })
        return createResponse(res, StatusCodes.OK, orders)
    } catch (error) {
        next(error)
    }
}

const getUnassignedDeliveries = async (req, res, next) => {
    try {
        let orders = await Order.find({ assignedAgent: null }).populate("items.product").exec()
        orders = orders.map((order) => {
            const groupedItems = order.items.reduce((acc, item) => {
                const product = item.product
                const key = `${product.itemName}-${item.color}-${item.size}`

                if (!acc[key]) {
                    acc[key] = {
                        ...product.toObject(),
                        color: item.color || null,
                        size: item.size || null,
                        quantity: 0,
                    }
                }

                acc[key].quantity += item.quantity || 1
                return acc
            }, {})

            return {
                ...order.toObject(),
                items: Object.values(groupedItems),
            }
        })
        return createResponse(res, StatusCodes.OK, orders)
    } catch (error) {
        next(error)
    }
}

module.exports = { getMyDeliveries, getUnassignedDeliveries }
