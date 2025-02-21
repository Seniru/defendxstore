require("dotenv").config()

const jwt = require("jsonwebtoken")

const { JWT_SECRET } = process.env

const createToken = (user) => {
    let token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
    )
    return token
}

module.exports = createToken
