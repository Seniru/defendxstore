const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const { getMyDeliveries, getUnassignedDeliveries } = require("../controllers/deliveries")

router.get("/my", requireRole(roles.DELIVERY_AGENT), getMyDeliveries)
router.get("/unassigned", requireRole(roles.DELIVERY_AGENT), getUnassignedDeliveries)

module.exports = router
