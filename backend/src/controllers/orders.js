const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const jwt = require("jsonwebtoken")

const Order = require("../models/Order")
const User = require("../models/User")
const PromoCode = require("../models/Promocodes")

const getOrders = async (req, res, next) => {
    try {
        const { status } = req.query
        if (status && !["pending", "on_the_way", "delivered"].includes(status))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid status")
        const user = await User.findOne({ username: req.user.username }).exec()

        const query = { user: user._id }
        if (status) query.status = status
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

const createOrder = async (req, res, next) => {
    try {
        const { deliveryAddress, promocode } = req.body
        const user = await User.findOne({ username: req.user.username })
            .populate({ path: "cart.product" })
            .exec()
        const cart = user.cart

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

        let total = cart.map((item) => item.product.price).reduce((total, val) => total + val)
        // apply promotion codes
        if (promocode) {
            const code = await PromoCode.findOne({ promocode }).exec()
            if (!code)
                return createResponse(res, StatusCodes.NOT_FOUND, {
                    field: "promocode",
                    message: "Promocode not found",
                })
            const discount = total * (code.discount / 100)
            total -= discount
        }

        const order = new Order({
            user: user._id,
            status: "pending",
            orderdate: Date.now(),
            deliveryAddress,
            items: cart,
            price: total,
        })
        await order.save()

        user.cart = []
        await user.save()
        return createResponse(res, StatusCodes.CREATED, order)
    } catch (error) {
        next(error)
    }
}
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user

        const order = await Order.findOne({ _id: id })
            .populate("items.product")
            .populate({ path: "user", select: "username email" })
            .exec()
        if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "Order not found")
        if (!user.roles.includes("DELIVERY_AGENT") && user.username !== order.user.username)
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not authorized to access this order",
            )

        const groupedItems = order.items.reduce((acc, item) => {
            const product = item.product
            const key = `${item.product.itemName}-${item.color}-${item.size}`

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

        return createResponse(res, StatusCodes.OK, {
            ...order.toObject(),
            items: Object.values(groupedItems),
        })
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
