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
            .populate("cart.productId")
            .exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, user.cart)
    } catch (error) {
        next(error)
    }
}

const addItem = async (req, res, next) => {
    try {
        const { productId, size, color, amount } = req.body
        if (!productId || !size || !color)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "You need to specify productId, size and color",
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
        user.cart.push(req.body)
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
