require("dotenv").config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")

const verify = async (req, res, next) => {
    try {
        const { token } = req.query
        if (!token) return createResponse(res, StatusCodes.BAD_REQUEST, "token is not present")

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // the jwt should contain the EMAIL_VERIFICATION field to prevent a token bypass
            // user's can set their own login token as the token for the verification,
            // as the login token also contains the email field
            // setting the action prevents this from happening
            if (decoded.action !== "EMAIL_VERIFICATION")
                return createResponse(res, StatusCodes.UNAUTHORIZED, "Invalid token")
            if (req.user.email != decoded.email)
                return createResponse(
                    res,
                    StatusCodes.FORBIDDEN,
                    "This token does not belong to this user",
                )

            const user = await User.findOneAndUpdate(
                { email: decoded.email },
                { verified: true },
            ).exec()
            if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
            user.pushNotification("You are successfully verified!")
        } catch (error) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid token")
        }
        return createResponse(res, StatusCodes.OK, "User verified")
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
}

module.exports = {
    verify,
    login,
}
