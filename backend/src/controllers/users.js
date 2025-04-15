require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const createResponse = require("../utils/createResponse")
const createToken = require("../utils/createToken")
const User = require("../models/User")
const logger = require("../utils/logger")
const { sendMail } = require("../services/email")

const permissions = {
    USER: 1 << 0,
    DELIVERY_AGENT: 1 << 1,
    SUPPORT_AGENT: 1 << 2,
    ADMIN: 1 << 3,
}

const getAllUsers = async (req, res, next) => {
    try {
        const search = req.query.search || ""
        const type = req.query.type

        if (type && !["USER", "SUPPORT_AGENT", "DELIVERY_AGENT", "ADMIN"].includes(type))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid type")

        let users = await User.find(
            { username: { $regex: search, $options: "i" } },
            {
                username: 1,
                email: 1,
                deliveryAddress: 1,
                contactNumber: 1,
                role: 1,
                profileImage: {
                    $cond: {
                        if: { $ifNull: ["$profileImage", false] },
                        then: {
                            $concat: [
                                `${req.protocol}://${req.get("host")}/api/users/`,
                                "$username",
                                "/profileImage",
                            ],
                        },
                        else: null,
                    },
                },
            },
        ).exec()

        users = users.map((user) => user.applyDerivations())
        // apply filters
        if (type) users = users.filter((user) => user.role.includes(type))

        return createResponse(res, StatusCodes.OK, { users })
    } catch (error) {
        next(error)
    }
}

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

        // create verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h",
        })

        // send verification email
        sendMail(email, "Defendxstore Email verification", "verify-email", {
            username,
            url: `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`,
        })
        user.pushNotification("Welcome to DefendX! Check your inbox to verify your email")

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

const deleteUser = async (req, res, next) => {
    try {
        const { username } = req.params
        if (!req.user.roles.includes("ADMIN") && username !== req.user.username)
            return createResponse(res, StatusCodes.FORBIDDEN, "You cannot delete this user")

        const user = await User.findOneAndDelete({ username }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, "User deleted")
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const { username } = req.params
        let user = await User.findOne({ username }, "-password").exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        user = user.applyDerivations()
        if (
            !req.user.roles.includes("ADMIN") &&
            req.user.username !== username &&
            !user.role.includes("DELIVERY_AGENT")
        )
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not authorized to view this user",
            )

        return createResponse(res, StatusCodes.OK, { user })
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { username } = req.params
        const { password } = req.body
        if (!req.user.roles.includes("ADMIN") && username !== req.user.username)
            return createResponse(res, StatusCodes.FORBIDDEN, "You cannot edit this user")

        if (!password || password.toString() === "")
            return createResponse(res, StatusCodes.BAD_REQUEST, "You must provide the password")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.findOneAndUpdate({ username }, { password: hashedPassword }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        return createResponse(res, StatusCodes.OK, "Password changed")
    } catch (error) {
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

const changeProfileImage = async (req, res, next) => {
    try {
        const { username } = req.params
        const { image } = req.body

        if (!req.user.roles.includes("ADMIN") && username !== req.user.username)
            return createResponse(res, StatusCodes.FORBIDDEN, "You cannot edit this user")

        if (!image || !image.match(/^data:(.+);base64,(.*)$/))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid profile image format")

        const user = await User.findOneAndUpdate(
            { username },
            { profileImage: image },
            { runValidators: true },
        ).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, "Image updated successfully")
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
        }
        next(error)
    }
}

const addRole = async (req, res, next) => {
    try {
        const { username } = req.params
        const { role } = req.body
        if (!role || !["USER", "DELIVERY_AGENT", "SUPPORT_AGENT", "ADMIN"].includes(role))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid role")

        const user = await User.findOne({ username })
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        user.role |= permissions[role]
        await user.save()
        return createResponse(res, StatusCodes.OK, "Role added")
    } catch (error) {
        next(error)
    }
}

const removeRole = async (req, res, next) => {
    try {
        const { username, role } = req.params
        if (!["USER", "DELIVERY_AGENT", "SUPPORT_AGENT", "ADMIN"].includes(role))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid role")

        const user = await User.findOne({ username }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")

        user.role &= (2 ** Object.keys(permissions).length - 1) & ~permissions[role]
        await user.save()
        return createResponse(res, StatusCodes.OK, "Role removed")
    } catch (error) {
        next(error)
    }
}

const editUser = async (req, res, next) => {
    try {
        const { username } = req.params
        const { deliveryAddress, contactNumber } = req.body

        if (!req.user.roles.includes("ADMIN") && username !== req.user.username)
            return createResponse(res, StatusCodes.FORBIDDEN, "You cannot edit this user")

        let update = { deliveryAddress }
        if (contactNumber) update.contactNumber = [contactNumber]

        const user = await User.findOneAndUpdate({ username }, update)

        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, "Editted")
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
        }
        next(error)
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    getUser,
    changePassword,
    getUserProfileImage,
    changeProfileImage,
    addRole,
    removeRole,
    editUser,
}
