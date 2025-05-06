const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const jwt = require("jsonwebtoken")

const Order = require("../models/Order")
const User = require("../models/User")
const PromoCode = require("../models/Promocodes")
const logger = require("../utils/logger")
const { sendMail } = require("../services/email")
const OrderReport = require("../models/reports/OrderReport")
const Expense = require("../models/Expense")

const getOrders = async (req, res, next) => {
    try {
        const { status } = req.query
        if (status && !["pending", "on_the_way", "delivered"].includes(status))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid status")
        const user = await User.findOne({ username: req.user.username }).exec()

        const query = { user: user._id }
        if (status) query.status = status
        let orders = await Order.find(query)
            .populate("items.product")
            .populate({ path: "user", select: "username email contactNumber" })
            .populate({ path: "assignedAgent", select: "username email contactNumber" })
            .exec()

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

const sendInvoiceToEmail = async (user, data) => {
    try {
        let rows = []

        const groupedItems = Object.values(
            data.items.reduce((acc, item) => {
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
            }, {}),
        )

        for (let item of groupedItems) {
            let row = `
            <tr>
                <td style="padding: 8px"><b>${item.itemName}</b> (${item.size})</td>
                <td style="padding: 8px">
                    <span
                        style="
                            display: inline-block;
                            width: 15px;
                            height: 15px;
                            background-color: ${item.color};
                            border-radius: 3px;
                        "
                    ></span>
                </td>
                <td style="padding: 8px; text-align: right">LKR ${item.price}</td>
                <td style="padding: 8px; text-align: right">${item.quantity}</td>
                <td style="padding: 8px; text-align: right">LKR ${item.price * item.quantity}</td>
            </tr>`
            rows.push(row)
        }

        sendMail(user.email, "DefendxStore Order Invoice", "invoice", {
            email: user.email,
            username: user.username,
            orderId: data.orderId,
            orderDate: data.orderDate,
            deliveryAddress: data.deliveryAddress,
            total: data.total,
            items: rows.join(""),
        })
    } catch (error) {
        logger.error(error.toString())
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

        if (user.verified)
            await sendInvoiceToEmail(user, {
                orderId: order._id,
                orderDate: order.orderdate,
                deliveryAddress: order.deliveryAddress,
                items: cart,
                total,
            })

        user.cart = []
        await user.save()

        await OrderReport.create({
            user: user._id,
            action: OrderReport.actions.createOrder,
            data: {},
        })

        try {
            for (let item of order.items) {
                await user.incrementProgress("casualShopper")
                if (item.product.itemName == "The Rose Collection - Embroidered")
                    await user.incrementProgress("roseEnthusiast")
            }
        } catch (error) {
            logger.error(error.toString())
        }

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

        await OrderReport.create({
            user: user._id,
            action: OrderReport.actions.deleteOrder,
            data: { orderId: order._id },
        })
        return createResponse(res, StatusCodes.OK, "Order deleted")
    } catch (error) {
        next(error)
    }
}

const acquireDelivery = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ username: req.user.username }).exec()
        const order = await Order.findOne({ _id: id }).exec()
        if (!order) return createResponse(res, StatusCodes.NOT_FOUND, "Order not found")
        if (order.status === "delivered")
            return createResponse(res, StatusCodes.FORBIDDEN, "Already completed")
        if (order.assignedAgent)
            return createResponse(res, StatusCodes.CONFLICT, "Already assigned")

        order.assignedAgent = user._id
        await order.save()

        const orderUser = await User.findById(order.user).exec()
        await orderUser.pushNotification(
            `${user.username} has been assigned for the delivery of your order (Order ID: #${id})`,
        )

        await OrderReport.create({
            user: user._id,
            action: OrderReport.actions.acquireDelivery,
            data: { orderId: order._id },
        })
        return createResponse(res, StatusCodes.OK, "Order acquired")
    } catch (error) {
        next(error)
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body
        const { id } = req.params
        if (!status || !["pending", "on_the_way", "delivered"].includes(status))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid status")

        const user = await User.findOne({ username: req.user.username }).exec()
        const order = await Order.findOne({ _id: id }).exec()
        if (!order.assignedAgent || !order.assignedAgent.equals(user._id))
            return createResponse(res, StatusCodes.FORBIDDEN, "This order is not assigned to you")

        order.status = status
        await order.save()

        const orderUser = await User.findById(order.user).exec()
        switch (status) {
            case "on_the_way":
                await orderUser.pushNotification(`Your order is on the way! (Order ID: #${id}`)
                break
            case "delivered":
                await orderUser.pushNotification(
                    `Your order has been delivered! (Order ID: #${id})`,
                )
                break
            default:
                break
        }

        if (order.status == "delivered") {
            await Expense.create({
                date: Date.now(),
                amount: 200,
                description: `Delivery of order #${order._id}`,
                category: "Delivery cost",
            })
            await orderUser.incrementProgress("firstPurchase")
        }

        await OrderReport.create({
            user: user._id,
            action: OrderReport.actions.updateOrderStatus,
            data: { orderId: order._id, status },
        })
        return createResponse(res, StatusCodes.OK, "Order status updated")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    deleteOrder,
    acquireDelivery,
    updateOrderStatus,
}
