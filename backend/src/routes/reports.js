const express = require("express")
const router = express.Router()
const { requireRole, roles } = require("../middlewares/auth")

const { getUsersReport, getOrdersReport, getSupportReport } = require("../controllers/reports")

router.get("/users", requireRole(roles.ADMIN), getUsersReport)
router.get("/orders", requireRole(roles.DELIVERY_AGENT), getOrdersReport)
router.get("/support", requireRole(roles.SUPPORT_AGENT), getSupportReport)

module.exports = router
