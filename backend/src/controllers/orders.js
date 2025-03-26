const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const jwt = require("jsonwebtoken")
const Order = require("../models/Order")

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).exec()
        return createResponse(res, StatusCodes.OK, orders)
    } catch (error) {
        next(error)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const { cart, deliveryAddress } = req.body
        // get user information
        let token = req.headers.authorization
        let user = null
        if (token) {
            token = token.split(" ")[1]
            user = jwt.verify(token, process.env.JWT_SECRET)
        }

        if (!Array.isArray(cart)) {
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Invalid cart data. Cart must be an array.",
            )
        }

        if (cart.length === 0) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Cart is empty.")
        }

        console.log("Cart has items:", cart, user)

        const order = new Order({
            username: user?.username,
            status: "pending",
            orderdate: Date.now(),
            deliveryAddress,
            items: cart,
            price: 1000,
        })
        await order.save()
        return createResponse(res, StatusCodes.CREATED, order)
    } catch (error) {
        next(error)
    }
}
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user

        const order = await Order.findOne({ _id: id }).exec()
        if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "Order not found")
        if (!user.roles.includes("DELIVERY_AGENT") && user.username !== order.username)
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not authorized to access this order",
            )

        return createResponse(res, StatusCodes.OK, { order })
    } catch (error) {
        next(error)
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const order = await Order.findOne({ _id: id }).exec()
        if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "Order not found")
        if (!user.roles.includes("ADMIN") && user.username !== order.username)
            return createResponse(res, StatusCodes.FORBIDDEN, "You cannot delete this order")

        await Order.findOneAndDelete({ _id: id }).exec()
        return createResponse(res, StatusCodes.OK, "Order deleted")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    deleteOrder,
}
