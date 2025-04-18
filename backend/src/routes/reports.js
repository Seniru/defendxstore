const express = require("express")
const router = express.Router()
const { requireRole, roles } = require("../middlewares/auth")

const { getReport } = require("../controllers/reports")

router.get("/:type", requireRole(roles.ADMIN), getReport)

module.exports = router
