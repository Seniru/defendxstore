const mongoose = require("mongoose")
const Item = require("../models/Item")
const createResponse = require("../utils/createResponse")
const { StatusCodes } = require("http-status-codes")

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

// Create Item
const createItem = async (req, res) => {
    const item = req.body
    const newItem = new Item(item)
    try {
        await newItem.save()
        return createResponse(res, StatusCodes.CREATED, newItem)
    } catch (error) {
        next(error)
    }
}

// Update Item
const updateItem = async (req, res) => {
    const { id } = req.params
    const item = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid id for item")
        }
        const updatedItem = await Item.findByIdAndUpdate(id, item, { new: true })
        if (!updatedItem) {
            return createResponse(res, StatusCodes.NOT_FOUND, "Item not found")
        }
        return createResponse(res, StatusCodes.OK, updatedItem)
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
    createItem,
    updateItem,
    deleteItem,
}
