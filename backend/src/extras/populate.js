// script to populate the database for testing purposes

const mongoose = require("mongoose")
const logger = require("../utils/logger")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")

const User = require("../models/User")
const Item = require("../models/Item")
const Order = require("../models/Order")

const populateUsers = async () => {
    logger.info("Populating users...")

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash("pass", salt)

    const admin = new User({
        username: "admin",
        email: "admin@defendxstore.com",
        role: 15,
        password,
    })

    await admin.save()

    // create 5 users
    const users = []
    for (let i = 1; i <= 5; i++) {
        const user = new User({
            username: `user${i}`,
            email: `user${i}@defendxstore.com`,
            role: 1,
            password,
        })
        users.push(user)
    }

    await User.insertMany(users)

    // create 5 delivery agents
    const deliveryAgents = []
    for (let i = 1; i <= 5; i++) {
        const deliveryAgent = new User({
            username: `deliveryAgent${i}`,
            email: `agent${i}@defendxstore.com`,
            role: 3,
            password,
        })
        deliveryAgents.push(deliveryAgent)
    }

    await User.insertMany(deliveryAgents)

    // create 5 support agents
    const supportAgents = []
    for (let i = 1; i <= 5; i++) {
        const supportAgent = new User({
            username: `supportAgent${i}`,
            email: `support${i}@defendxstore.com`,
            role: 5,
            password,
        })
        supportAgents.push(supportAgent)
    }

    await User.insertMany(supportAgents)
    logger.info("Populated users!")
}

const populate = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/test"
    logger.debug(`Using MongoDB URI: ${MONGO_URI}`)
    logger.info("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    logger.info("Connected to MongoDB!")

    await populateUsers()
    await populateItems()
    await populateOrders()

    logger.info("Populated all data!")

    logger.info("Closing MongoDB connection")
    await mongoose.connection.close()
}

populate()
