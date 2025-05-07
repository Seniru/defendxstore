const mongoose = require("mongoose")
const Item = require("../models/Item")
const User = require("../models/User")
const Expense = require("../models/Expense")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")
const { sendMail } = require("../services/email")
const { roles } = require("../utils/getRoles")
const Supply = require("../models/Supply")
const ExcelJS = require("exceljs")

const { columns, addTable, createAttachment } = require("../utils/spreadsheets")

require("dotenv").config()

const getAllItemsSpreadsheet = (res, items) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Inventory")
    worksheet.columns = columns.items
    addTable(
        worksheet,
        [
            "Item Name",
            "Category",
            "Description",
            "Colors",
            "Price (LKR)",
            "Size",
            "Quantity",
            "Stock Status",
        ],
        items.map((product) => [
            product.itemName,
            product.category,
            product.description || "",
            Array.isArray(product.colors) ? product.colors.join(", ") : "",
            product.price,
            product.size,
            product.quantity,
            product.stock,
        ]),
    )

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.eachCell((cell, colNumber) => {
                // Add color coding for stock status
                if (colNumber === 8) {
                    // Stock status column
                    const stockStatus = cell.value
                    if (stockStatus === "Out of Stock") {
                        cell.font = { color: { argb: "FFFF0000" } } // Red
                    } else if (stockStatus === "Running Low") {
                        cell.font = { color: { argb: "FFFF9900" } } //yellow
                    } else if (stockStatus === "In Stock") {
                        cell.font = { color: { argb: "FF008000" } } //green
                    }
                }
            })
        }
    })

    return createAttachment(workbook, res)
}

// Get All Items
const getAllItems = async (req, res, next) => {
    try {
        const { downloadSheet } = req.query
        const items = await Item.find().sort({ _id: -1 }).exec()
        if (downloadSheet == "true") return getAllItemsSpreadsheet(res, items)
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

        let result = await response.json()
        result = result.slice(0, 8)

        const items = await Item.find({ _id: { $in: result.map((item) => item[0]) } }).exec()
        const itemMap = new Map(items.map((item) => [item._id.toString(), item]))
        const sortedItems = result.map((item) => itemMap.get(item[0]))

        return createResponse(res, StatusCodes.OK, sortedItems)
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

        let result = await response.json()
        result = result.slice(0, 8)

        const items = await Item.find({ _id: { $in: result } }).exec()
        const itemMap = new Map(items.map((item) => [item._id.toString(), item]))
        const sortedItems = result.map((item) => itemMap.get(item))

        return createResponse(res, StatusCodes.OK, sortedItems)
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
    if (typeof item.size == "string") item.size = item.size.split(",")
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
        if (!item) return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        const restockedAmount = amount - item.quantity
        const sellingPrice = item.price * restockedAmount
        const cost = sellingPrice * 0.85

        await Expense.create({
            date: Date.now(),
            amount: cost,
            description: `Restock ${item.itemName}`,
            category: "Supply costs",
        })

        await Supply.create({
            item: id,
            date: Date.now(),
            orderedQuantity: restockedAmount,
            estimatedCost: cost,
            estimatedSellingPrice: sellingPrice,
            estimatedProfit: sellingPrice - cost,
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
