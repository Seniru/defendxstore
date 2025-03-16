const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/items")

// Get All Items
router.get("/", ItemController.getAllItems)
// Get Item by ID
router.get("/:id", ItemController.getItemById)
// Create Item
router.post("/", ItemController.createItem)
// Update Item
router.put("/:id", ItemController.updateItem)
// Delete Item
router.delete("/:id", ItemController.deleteItem)

module.exports = router
