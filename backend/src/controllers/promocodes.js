const mongoose = require("mongoose")
const Item = require("../models/Promocodes")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")
const Promocodes = require("../models/Promocodes")

const getAllPromocodes = async (req, res, next) => {
    try {
        const promocodes = await Promocodes.find()
        createResponse(res, StatusCodes.OK, promocodes)
    } catch (error) {
        next(error)
    }
}


const createPromocodes = async (req, res, next) => {
    const promocodes= req.body
    const newPromocode = new Promocodes(promocodes)
    try {
        await newPromocode.save()
        return createResponse(res, StatusCodes.CREATED, newPromocode)
    } catch (error) {
        next(error)
    }
}

const updatePromocodes = async (req, res, next) => {
    const { promocode } = req.params
    const { validuntil, discount} = req.body
    try {
        console.log(await Promocodes.findOne({ promocode }))
        const updatedPromocodes = await Promocodes.findOneAndUpdate( { promocode },  {validuntil, discount}, { new: true }).exec()
        if (!updatedPromocodes) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Promocode not found")
        }
        return createResponse(res, StatusCodes.OK, updatedPromocodes)
    } catch (error) {
        next(error)
    }
}

const deletePromocodes= async (req, res, next) => {
    const { promocode } = req.params
    try {
       console.log(promocode)
        const deletedPromocodes = await Promocodes.findOneAndDelete({promocode}).exec()
        if (!deletedPromocodes) {
            return createResponse(res, StatusCodes.NOT_FOUND, "OK")
        }
        return createResponse(res, StatusCodes.OK, "Promocode not found")
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
