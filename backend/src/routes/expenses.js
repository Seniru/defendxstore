const express = require("express")
const router = express.Router()

const { getExpenses, createExpense } = require("../controllers/expenses")
const { requireRole, roles } = require("../middlewares/auth")

router.get("/", requireRole(roles.ADMIN), getExpenses)
router.post("/", requireRole(roles.ADMIN), createExpense)

module.exports = router
