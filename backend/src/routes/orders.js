const express = require("express")
const router = express.Router()
const { getOrders, createOrder, getOrder, deleteOrder } = require("../controllers/orders")
const { requireRole, roles } = require("../middlewares/auth")

router.get("/", requireRole(roles.USER), getOrders)
router.post("/", requireRole(roles.USER), createOrder)
router.get("/:id", requireRole(roles.USER), getOrder)
router.delete("/:id", requireRole(roles.USER), deleteOrder)

module.exports = router
