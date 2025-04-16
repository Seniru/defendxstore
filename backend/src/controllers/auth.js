require("dotenv").config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const User = require("../models/User")
const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")
const { sendMail } = require("../services/email")
const Promocodes = require("../models/Promocodes")

const verify = async (req, res, next) => {
    try {
        const { token } = req.query
        if (!token) return createResponse(res, StatusCodes.BAD_REQUEST, "token is not present")

        let user

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
            user = await User.findOneAndUpdate(
                { email: decoded.email },
                { verified: true },
                { new: true },
            )
                .populate("referredBy")
                .exec()
        } catch (error) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid token")
        }

        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        if (user.verified) return createResponse(res, StatusCodes.OK, "Already verified")
        user.pushNotification("You are successfully verified!")
        const referredBy = user.referredBy
        if (referredBy) {
            const promocode = await Promocodes.generateRandomCode(
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
                5,
                referredBy._id,
            )
            referredBy.pushNotification(
                `You've earned a reward for referring someone! Use code ${promocode.promocode} at checkout.`,
            )
        }
        return createResponse(res, StatusCodes.OK, "User verified")
    } catch (error) {
        next(error)
    }
}

const initiateVerification = async (req, res, next) => {
    try {
        const email = req.user.email
        const user = await User.findOne({ email }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        if (user.verified) return createResponse(res, StatusCodes.BAD_REQUEST, "Already verified")
        // create verification token
        const verificationToken = jwt.sign(
            { email, action: "EMAIL_VERIFICATION" },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h",
            },
        )

        // send verification email
        sendMail(email, "Defendxstore Email verification", "verify-email", {
            username: user.username,
            url: `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`,
        })
        user.pushNotification("Verification email sent! Check your inbox to verify your email")
        return createResponse(res, StatusCodes.OK, "Email sent")
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
    initiateVerification,
    login,
}
