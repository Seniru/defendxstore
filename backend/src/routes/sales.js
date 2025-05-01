const express = require("express")
const router = express.Router()

const { getSales, getMonthlySales, compareItems } = require("../controllers/sales")
const { requireRole, roles } = require("../middlewares/auth")

// should be admin only route
// router.get("/", requireRole(roles.ADMIN), getSales)
router.get("/", getSales)
router.get("/monthly", getMonthlySales)
router.get("/compare", compareItems)

module.exports = router
