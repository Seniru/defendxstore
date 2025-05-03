const mongoose = require("mongoose")
const Item = require("../models/Item")
const User = require("../models/User")
const Expense = require("../models/Expense")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")
const { sendMail } = require("../services/email")
const { roles } = require("../utils/getRoles")
require("dotenv").config()

// Get All Items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find()
        createResponse(res, StatusCodes.OK, items)
    } catch (error) {
        next(error)
    }
}

// Get Item by ID
const getItemById = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid id for item")
        }
        const item = await Item.findById(id)
        if (!item) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        }
        return createResponse(res, StatusCodes.OK, item)
    } catch (error) {
        next(error)
    }
}

const getTrendingItems = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.AI_SERVICES_URI}/trending/items`)
        if (!response.ok)
            return createResponse(res, response.status, response.body || response.statusText)
        const result = await response.json()
        const items = await Item.find({ _id: { $in: result.map((item) => item[0]) } })
            .limit(8)
            .exec()
        return createResponse(res, StatusCodes.OK, items)
    } catch (error) {
        next(error)
    }
}

const getRecommendedItems = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        const response = await fetch(
            `${process.env.AI_SERVICES_URI}/recommendations/items?user_id=${user._id}`,
        )
        if (!response.ok)
            return createResponse(res, response.status, response.body || response.statusText)
        const result = await response.json()
        const items = await Item.find({ _id: { $in: result } })
            .limit(8)
            .exec()
        return createResponse(res, StatusCodes.OK, items)
    } catch (error) {
        next(error)
    }
}

// Create Item
const createItem = async (req, res) => {
    const item = req.body
    item.size = item.size.split(",")
    const newItem = new Item(item)
    try {
        await newItem.save()
        return createResponse(res, StatusCodes.CREATED, newItem)
    } catch (error) {
        next(error)
    }
}

// Update Item
const updateItem = async (req, res, next) => {
    const { id } = req.params
    const item = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid id for item")
        }

        const oldItem = await Item.findById(id)
        if (!oldItem) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        }

        const updatedItem = await Item.findByIdAndUpdate(id, item, { new: true })

        if (oldItem.stock !== "Out of Stock" && updatedItem.stock === "Out of Stock") {
            // Find all admin users
            const adminUsers = await User.find({
                role: { $bitsAllSet: roles.ADMIN },
            })

            if (adminUsers && adminUsers.length > 0) {
                //  table row for the email template
                const itemRow = `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;">${updatedItem.itemName}</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">${updatedItem.category}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${updatedItem.quantity}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #ff0000; font-weight: bold;">Out of Stock</td>
                    </tr>
                `

                // Send email to all admin users
                for (const admin of adminUsers) {
                    sendMail(admin.email, "URGENT: Item Out of Stock Alert", "stock_alert", {
                        title: "Out of Stock Alert",
                        itemCount: "1",
                        items: itemRow,
                        date: new Date().toLocaleDateString(),
                    })
                }
            }
        }

        return createResponse(res, StatusCodes.OK, updatedItem)
    } catch (error) {
        next(error)
    }
}

const restockItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const { amount } = req.body

        if (!amount) return createResponse(res, StatusCodes.BAD_REQUEST, "amount is not provided")

        const item = await Item.findByIdAndUpdate(id, { quantity: amount }).exec()
        const restockedAmount = item.quantity - amount

        await Expense.create({
            date: Date.now(),
            amount: (item.price - 650) * restockedAmount,
            description: `Restock ${item.itemName}`,
            category: "Supply costs",
        })

        if (!item) return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        return createResponse(res, StatusCodes.OK, "Restocked")
    } catch (error) {
        next(error)
    }
}

// Delete Item
const deleteItem = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid id for item")
        }
        const deletedItem = await Item.findByIdAndDelete(id)
        if (!deletedItem) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        }
        return createResponse(res, StatusCodes.OK, "Item deleted")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllItems,
    getItemById,
    getTrendingItems,
    getRecommendedItems,
    createItem,
    updateItem,
    restockItem,
    deleteItem,
}
