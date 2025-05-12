const mongoose = require("mongoose")
const Item = require("../models/Promocodes")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")
const Promocodes = require("../models/Promocodes")

const getAllPromocodes = async (req, res, next) => {
    try {
        const promocodes = await Promocodes.find()
            .populate({ path: "createdFor", select: "username" })
            .exec()
        createResponse(res, StatusCodes.OK, promocodes)
    } catch (error) {
        next(error)
    }
}

const createPromocodes = async (req, res, next) => {
    try {
        const promocodes = req.body
        const newPromocode = new Promocodes(promocodes)
        await newPromocode.save()
        return createResponse(res, StatusCodes.CREATED, newPromocode)
    } catch (error) {
        if (error.name === "ValidationError") {
            return createResponse(res, StatusCodes.BAD_REQUEST, error.message)
        }
        if (error.code === 11000) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Promocode already exists")
        }
        next(error)
    }
}

const updatePromocodes = async (req, res, next) => {
    try {
        const { promocode } = req.params
        const { validuntil, discount } = req.body

        if (!validuntil || !discount)
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                "Valid until and discount are required",
            )

        const updatedPromocodes = await Promocodes.findOneAndUpdate(
            { promocode },
            { validuntil, discount },
            { new: true, runValidators: true },
        ).exec()

        if (!updatedPromocodes) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Promocode not found")
        }
        return createResponse(res, StatusCodes.OK, updatedPromocodes)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError)
            return createResponse(res, StatusCodes.BAD_REQUEST, error.message)
        if (error instanceof mongoose.Error.CastError)
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid promocode format")

        next(error)
    }
}

const deletePromocodes = async (req, res, next) => {
    const { promocode } = req.params
    try {
        const deletedPromocodes = await Promocodes.findOneAndDelete({ promocode }).exec()
        if (!deletedPromocodes) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Promocode not found")
        }
        return createResponse(res, StatusCodes.OK, "Deleted")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllPromocodes,
    createPromocodes,
    updatePromocodes,
    deletePromocodes,
}
