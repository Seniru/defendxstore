const express = require("express")
const router = express.Router()
const { getOrders, createOrder, getOrder } = require("../controllers/orders")
const { requireRole, roles } = require("../middlewares/auth")

router.get("/", getOrders)
router.post("/", createOrder)
router.get("/:order", requireRole(roles.USER), getOrder)

module.exports = router