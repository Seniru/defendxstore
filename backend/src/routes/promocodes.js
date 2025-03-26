const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const PromocodeController = require("../controllers/promocodes")
const { requireRole, roles } = require("../middlewares/auth")

// Get All promocodes
router.get("/", requireRole(roles.ADMIN), PromocodeController.getAllPromocodes)

// Create promocodes - Admin Only
router.post("/", requireRole(roles.ADMIN), PromocodeController.createPromocodes)

// Update promocodes - Admin Only
router.put("/:promocode", requireRole(roles.ADMIN), PromocodeController.updatePromocodes)

// Delete promocodes - Admin Only
router.delete("/:promocode", requireRole(roles.ADMIN), PromocodeController.deletePromocodes)

module.exports = router
