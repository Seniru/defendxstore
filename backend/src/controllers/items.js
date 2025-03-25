const mongoose = require("mongoose")
const Item = require("../models/Item")

// Get All Items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find()
        createResponse(res, StatusCodes.OK, items)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// Get Item by ID
const getItemById = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "No item with that id" })
        }
        const item = await Item.findById(id)
        if (!item) {
            return res.status(404).json({ message: "Item not found" })
        }
        res.status(200).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create Item
const createItem = async (req, res) => {
    const item = req.body
    const newItem = new Item(item)
    try {
        await newItem.save()
        res.status(201).json(newItem)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// Update Item
const updateItem = async (req, res) => {
    const { id } = req.params
    const item = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "No item with that id" })
        }
        const updatedItem = await Item.findByIdAndUpdate(id, { new: true })
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" })
        }
        res.status(200).json(updatedItem)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete Item
const deleteItem = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "No item with that id" })
        }
        const deletedItem = await Item.findByIdAndDelete(id)
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" })
        }
        res.status(200).json({ message: "Item deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
}
