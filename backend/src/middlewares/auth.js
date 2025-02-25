require("dotenv").config()

const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")

const roles = {
    USER: "USER",
    DELIVERY_AGENT: "DELIVERY_AGENT",
    SUPPORT_AGENT: "SUPPORT_AGENT",
    ADMIN: "ADMIN",
}

const requireRole = (role) => (req, res, next) => {
    let token = req.headers.authorization
    if (!token) return createResponse(res, StatusCodes.UNAUTHORIZED, "You must log in to continue")
    token = token.split(" ")[1]

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let userRole = decoded.roles
        // admins can bypass all permission restrictions
        let isAdmin = userRole.includes("ADMIN")
        if (!isAdmin && !userRole.includes(role))
            return createResponse(res, StatusCodes.FORBIDDEN, "Forbidden")
        req.user = decoded
        next()
    } catch (error) {
        logger.error(error)
        return createResponse(res, StatusCodes.UNAUTHORIZED, "Invalid token")
    }
}

module.exports = {
    roles,
    requireRole,
}
