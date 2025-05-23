require("dotenv").config()

const os = require("os")
const path = require("path")
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")

const logger = require("./utils/logger")
const { StatusCodes } = require("http-status-codes")
const createResponse = require("./utils/createResponse")
const usersRoute = require("./routes/users")
const cartRoute = require("./routes/cart")
const authRoute = require("./routes/auth")
const ticketsRoute = require("./routes/tickets")
const forumRoute = require("./routes/forums")
const itemRoute = require("./routes/items")
const orderRoute = require("./routes/orders")
const deliveriesRoute = require("./routes/deliveries")
const promocodesRoute = require("./routes/promocodes")
const notificationsRoute = require("./routes/notifications")
const perksRoute = require("./routes/perks")
const reportsRoute = require("./routes/reports")
const salesRoute = require("./routes/sales")
const expensesRoute = require("./routes/expenses")

// middlewares
app.use(cors())
app.use(express.json({ limit: "4mb" }))
app.use(
    morgan("dev", {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
)
app.use(express.static(path.join(__dirname, "public")))

// routes
app.use("/api/auth", authRoute)
app.use("/api/users/:username/cart", cartRoute)
app.use("/api/users", usersRoute)
app.use("/api/tickets", ticketsRoute)
app.use("/api/forums", forumRoute)
app.use("/api/items", itemRoute)
app.use("/api/orders", orderRoute)
app.use("/api/deliveries", deliveriesRoute)
app.use("/api/promo", promocodesRoute)
app.use("/api/notifications", notificationsRoute)
app.use("/api/perks", perksRoute)
app.use("/api/reports", reportsRoute)
app.use("/api/sales/expenses", expensesRoute)
app.use("/api/sales", salesRoute)

app.use((err, req, res, next) => {
    logger.error(err.stack)
    createResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
    next()
})

app.use((req, res) => createResponse(res, StatusCodes.NOT_FOUND, "Requested route not found"))

const start = async () => {
    const MONGO_URI =
        process.env.NODE_ENV == "test"
            ? "mongodb://localhost/defendx_test"
            : process.env.MONGO_URI || "mongodb://localhost/test"
    const SERVER_PORT = process.env.SERVER_PORT || 8888
    logger.debug(`Using MongoDB URI: ${MONGO_URI}`)
    logger.info("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    logger.info("Connected to MongoDB!")

    if (process.env.NODE_ENV == "test") return

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
