const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes")

const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")
const User = require("../models/User")

const createUser = async (req, res, next) => {
    try {
        const { username, email, password, deliveryAddress, contactNumber, profileImage } = req.body
        if (!password)
            return createResponse(res, StatusCodes.BAD_REQUEST, [
                {
                    field: "password",
                    message: "You must provide a password",
                },
            ])
        // check if profileImage is in the correct format
        if (profileImage && !profileImage.match(/^data:(.+);base64,(.*)$/))
            return createResponse(res, StatusCodes.BAD_REQUEST, [
                {
                    field: "profileImage",
                    message: "Invalid profile image format",
                },
            ])

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({
            username,
            email,
            password: hashedPassword,
            deliveryAddress,
            contactNumber,
            profileImage,
        })
        await user.save()
        const token = createToken(user)
        return createResponse(res, StatusCodes.CREATED, { token })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return createResponse(
                res,
                StatusCodes.BAD_REQUEST,
                Object.keys(error.errors).map((key) => ({
                    field: key,
                    message: error.errors[key].message,
                })),
            )
        } else if (error.message == "User already exist with this email") {
            return createResponse(res, StatusCodes.CONFLICT, [
                {
                    field: "email",
                    message: error.message,
                },
            ])
        } else if (error.message == "Username taken") {
            return createResponse(res, StatusCodes.CONFLICT, [
                {
                    field: "username",
                    message: error.message,
                },
            ])
        }
        next(error)
    }
}

const getUserProfileImage = async (req, res, next) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        // return image
        const { profileImage } = user
        if (!profileImage)
            return createResponse(res, StatusCodes.NOT_FOUND, "No profile image found")

        const match = profileImage.match(/^data:(.+);base64,(.*)$/)

        const fileType = match[1]
        const imageData = match[2]

        res.status(StatusCodes.OK)
            .set({ "Content-Type": fileType })
            .send(Buffer.from(imageData, "base64"))
    } catch (error) {
        next(error)
    }
}

module.exports = { createUser, getUserProfileImage }
