const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/items")
const { requireRole, roles } = require("../middlewares/auth")

// Get All Items
router.get("/", ItemController.getAllItems)

// Get Item by ID
router.get("/:id", ItemController.getItemById)

// Create Item - Admin Only
router.post("/", requireRole(roles.ADMIN), ItemController.createItem)

// Update Item - Admin Only
router.put("/:id", requireRole(roles.ADMIN), ItemController.updateItem)

// Delete Item - Admin Only
router.delete("/:id", requireRole(roles.ADMIN), ItemController.deleteItem)

module.exports = router
