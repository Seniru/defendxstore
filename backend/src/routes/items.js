const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/items")
const { requireRole, roles } = require("../middlewares/auth")

// Get All Items
router.get("/", ItemController.getAllItems)

// Get trending items
router.get("/trending", ItemController.getTrendingItems)

// Get recommended items
router.get("/recommended", requireRole(roles.USER), ItemController.getRecommendedItems)

// Get Item by ID
router.get("/:id", ItemController.getItemById)

// Create Item - Admin Only
router.post("/", requireRole(roles.ADMIN), ItemController.createItem)

// Update Item - Admin Only
router.put("/:id", requireRole(roles.ADMIN), ItemController.updateItem)

// Restock Item - Admin Only
router.post("/:id/restock", requireRole(roles.ADMIN), ItemController.restockItem)

// Delete Item - Admin Only
router.delete("/:id", requireRole(roles.ADMIN), ItemController.deleteItem)

module.exports = router
