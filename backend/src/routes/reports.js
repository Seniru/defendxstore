const express = require("express")
const router = express.Router()
const { requireRole, roles } = require("../middlewares/auth")

const { getUsersReport, getOrdersReport } = require("../controllers/reports")

router.get("/users", requireRole(roles.ADMIN), getUsersReport)
router.get("/orders", requireRole(roles.DELIVERY_AGENT), getOrdersReport)

module.exports = router
