require("dotenv").config()

const jwt = require("jsonwebtoken")
const { getRoles } = require("./getRoles")

const { JWT_SECRET } = process.env

const createToken = (user) => {
    let token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            role: user.role,
            roles: getRoles(user.role),
        },
        JWT_SECRET,
        { algorithm: "HS256" },
    )
    return token
}

module.exports = createToken
