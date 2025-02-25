require("dotenv").config()

const jwt = require("jsonwebtoken")

const { JWT_SECRET } = process.env

const permissions = {
    USER: 1 << 0,
    DELIVERY_AGENT: 1 << 1,
    SUPPORT_AGENT: 1 << 2,
    ADMIN: 1 << 3,
}

const createToken = (user) => {
    let userRoles = []
    for (let [role, bit] of Object.entries(permissions)) {
        if (user.role & bit) userRoles.push(role)
    }

    let token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            role: user.role,
            roles: userRoles,
        },
        JWT_SECRET,
        { algorithm: "HS256" },
    )
    return token
}

module.exports = createToken
