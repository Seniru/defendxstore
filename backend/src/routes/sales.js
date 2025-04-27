const express = require("express")
const router = express.Router()

const { getSales, getMonthlySales } = require("../controllers/sales")
const { requireRole, roles } = require("../middlewares/auth")

// should be admin only route
// router.get("/", requireRole(roles.ADMIN), getSales)
router.get("/", getSales)
router.get("/monthly", getMonthlySales)

module.exports = router
