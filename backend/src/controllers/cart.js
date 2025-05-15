const mongoose = require("mongoose")
const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const User = require("../models/User")
const Item = require("../models/Item")

const getCart = async (req, res, next) => {
    try {
        const { username } = req.params
        if (req.user.username != username)
            return createResponse(res, StatusCodes.FORBIDDEN, "Cannot access another user's cart")

        const user = await User.findOne({ username }, { cart: true })
            .populate("cart.product")
            .exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        let totalItems = 0
        let totalPrice = 0
        const groupedCart = user.cart.reduce((acc, item) => {
            const product = item.product.toObject()
            const key = `${product.itemName}-${item.color.toLowerCase()}`

            if (!acc[key]) {
                acc[key] = {
                    ...product,
                    color: item.color.toLowerCase(),
                    size: item.size,
                    quantity: 0,
                }
            }

            totalPrice += item.product.price
            totalItems++
            acc[key].quantity++
            return acc
        }, {})

        const cart = Object.values(groupedCart)

        return createResponse(res, StatusCodes.OK, { cart, totalItems, totalPrice })
    } catch (error) {
        next(error)
    }
}

const addItem = async (req, res, next) => {
    try {
        const { productId, size, color, quantity } = req.body
        if (!productId || !size || !color || !quantity)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "You need to specify productId, size, quantity and color",
            )

        if (!mongoose.Types.ObjectId.isValid(productId))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid id for item")

        const { username } = req.params
        if (req.user.username != username)
            return createResponse(res, StatusCodes.FORBIDDEN, "Cannot access another user's cart")

        const user = await User.findOne({ username })
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        const item = await Item.findById(productId).exec()
        if (!item) return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")

        for (let i = 0; i < quantity; i++) user.cart.push({ product: productId, size, color })
        await user.save()

        return createResponse(res, StatusCodes.OK, "Added item successfully")
    } catch (error) {
        next(error)
    }
}

const emptyCart = async (req, res, next) => {
    try {
        const { username } = req.params
        if (req.user.username != username)
            return createResponse(res, StatusCodes.FORBIDDEN, "Cannot empty another user's cart")

        const user = await User.findOneAndUpdate({ username }, { cart: [] })
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        return createResponse(res, StatusCodes.OK, "Cart emptied successfully")
    } catch (error) {
        next(error)
    }
}

module.exports = { getCart, addItem, emptyCart }
