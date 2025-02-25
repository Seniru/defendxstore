require("dotenv").config()

const os = require("os")
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")

const logger = require("./utils/logger")
const { StatusCodes } = require("http-status-codes")
const createResponse = require("./utils/createResponse")
const usersRoute = require("./routes/users")
const authRoute = require("./routes/auth")

// middlewares
app.use(cors())
app.use(express.json())
app.use(
    morgan("dev", {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
)

// routes
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)

app.use((err, req, res, next) => {
    logger.error(err.stack)
    createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
    next()
})

const start = async () => {
    const MONGO_URI =
        process.env.ENVIRONMENT == "test"
            ? "mongodb://localhost/defendx_test"
            : process.env.MONGO_URI || "mongodb://localhost/test"
    const SERVER_PORT = process.env.SERVER_PORT || 8888

    logger.info("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    logger.info("Connected to MongoDB!")

    if (process.env.ENVIRONMENT == "test") return

    logger.info("Starting server...")
    app.listen(SERVER_PORT, () => {
        let networkInterfaces = os.networkInterfaces()
        let address = networkInterfaces.wlo1 && networkInterfaces.wlo1[0].address
        logger.info("Server listening on")
        logger.info(`\tLocal:\thttp://127.0.0.1:${SERVER_PORT}`)
        address && logger.info(`\tIP:\thttp://${address}:${SERVER_PORT}`)
    })
}

start()

module.exports = app
