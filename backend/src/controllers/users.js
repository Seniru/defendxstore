const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")
const User = require("../models/User")

const createUser = async (req, res, next) => {
    try {
        const { username, email, password, deliveryAddress, contactNumber } = req.body
        if (!password)
            return createResponse(res, StatusCodes.BAD_REQUEST, "You must provide a password")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({
            username,
            email,
            password: hashedPassword,
            deliveryAddress,
            contactNumber,
        })
        await user.save()
        const token = createToken(user)
        return createResponse(res, StatusCodes.CREATED, { token })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errMsg = error.errors[Object.keys(error.errors)[0]].message
            return createResponse(res, StatusCodes.BAD_REQUEST, errMsg)
        } else if (error.message == "User already exist with this email") {
            return createResponse(res, StatusCodes.CONFLICT, error.message)
        }
        next(error)
    }
}

module.exports = { createUser }
