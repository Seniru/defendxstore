require("dotenv").config()

const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")

const login = async (req, res) => {
    let { email, password } = req.body
    let user = await User.findOne({ email }).exec()
    if (!user)
        return createResponse(res, StatusCodes.NOT_FOUND, {
            field: "email",
            message: "User not found",
        })

    if (bcrypt.compareSync(password, user.password)) {
        let token = createToken(user)
        return createResponse(res, StatusCodes.OK, { token })
    }
    return createResponse(res, StatusCodes.UNAUTHORIZED, {
        field: "password",
        message: "Invalid password",
    })
}

module.exports = {
    login,
}
