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

    try {
        await admin.save()
    } catch (error) {}

    // create 5 users
    for (let i = 1; i <= 5; i++) {
        try {
            const user = new User({
                username: `user${i}`,
                email: `user${i}@defendxstore.com`,
                role: 1,
                password,
            })
            await user.save()
        } catch (error) {}
    }

    //await User.insertMany(users)

    // create 5 delivery agents
    for (let i = 1; i <= 5; i++) {
        try {
            const deliveryAgent = new User({
                username: `deliveryAgent${i}`,
                email: `agent${i}@defendxstore.com`,
                role: 3,
                password,
            })
            await deliveryAgent.save()
        } catch (error) {}
    }

    //await User.insertMany(deliveryAgents)

    // create 5 support agents
    for (let i = 1; i <= 5; i++) {
        try {
            const supportAgent = new User({
                username: `supportAgent${i}`,
                email: `support${i}@defendxstore.com`,
                role: 5,
                password,
            })
            await supportAgent.save()
        } catch (error) {}
    }

    //await User.insertMany(supportAgents)
    logger.info("Populated users!")
}

const populateItems = async () => {
    logger.info("Populating items...")

    const imagePath = path.join(__dirname, "placeholder.png")
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = "data:image/jpeg;base64," + imageBuffer.toString("base64")

    const categories = ["Clothing", "Accessories", "Footwear"]
    const colorsList = [
        ["black", "white"],
        ["red", "blue"],
        ["green", "yellow"],
        ["purple", "orange"],
    ]
    const sizesList = [
        ["S", "M", "L"],
        ["M", "L", "XL"],
        ["XS", "S", "M", "L", "XL"],
    ]

    for (let i = 1; i <= 10; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        const randomColors = colorsList[Math.floor(Math.random() * colorsList.length)]
        const randomSizes = sizesList[Math.floor(Math.random() * sizesList.length)]
        const randomPrice = (Math.random() * 100 + 10).toFixed(2)
        const randomQty = Math.floor(Math.random() * 100) + 1

        let item = new Item({
            product: base64Image,
            itemName: `Item ${i}`,
            category: randomCategory,
            description: `This is a description for Item ${i}.`,
            colors: randomColors,
            price: Number(randomPrice),
            size: randomSizes,
            quantity: randomQty,
            stock: "In Stock",
        })
        try {
            await item.save()
        } catch (error) {}
    }
}

const populateOrders = async () => {
    logger.info("Populating orders...")

    const users = await User.find({ role: 1 }) // regular users
    const agents = await User.find({ role: 3 }) // delivery agents
    const items = await Item.find()

    if (users.length === 0 || agents.length === 0 || items.length === 0) {
        logger.warn("Not enough data to populate orders.")
        return
    }

    const getRandomDate = (start, end) =>
        new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

    const orders = []

    for (let i = 0; i < 50; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomAgent = agents[Math.floor(Math.random() * agents.length)]
        const orderItems = []

        const numberOfItems = Math.floor(Math.random() * 3) + 1
        let totalPrice = 0

        for (let j = 0; j < numberOfItems; j++) {
            const item = items[Math.floor(Math.random() * items.length)]
            const color = item.colors[Math.floor(Math.random() * item.colors.length)]
            const size = item.size[Math.floor(Math.random() * item.size.length)]
            totalPrice += item.price

            orderItems.push({
                product: item._id,
                color,
                size,
            })
        }

        const order = {
            user: randomUser._id,
            deliveryAddress: `123 Street ${i + 1}, Cityland`,
            orderdate: getRandomDate(new Date("2025-01-01"), new Date()),
            status: "delivered",
            items: orderItems,
            price: totalPrice,
            assignedAgent: randomAgent._id,
        }

        orders.push(order)
    }

    try {
        await Order.insertMany(orders)
    } catch (error) {
        logger.error("Error populating orders:", error)
    }
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
