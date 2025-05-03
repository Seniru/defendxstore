const express = require("express")
const router = express.Router()

const {
    getSales,
    getMonthlySales,
    compareItems,
    getSupplyMetrics,
} = require("../controllers/sales")
const { requireRole, roles } = require("../middlewares/auth")

router.get("/", requireRole(roles.ADMIN), getSales)
router.get("/monthly", requireRole(roles.ADMIN), getMonthlySales)
router.get("/compare", requireRole(roles.ADMINc), compareItems)
router.get("/supplyMetrics", requireRole(roles.ADMIN), getSupplyMetrics)

module.exports = router
