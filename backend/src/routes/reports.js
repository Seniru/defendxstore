const express = require("express")
const router = express.Router()
const { requireRole, roles } = require("../middlewares/auth")

const { getUsersReport } = require("../controllers/reports")

router.get("/users", requireRole(roles.ADMIN), getUsersReport)

module.exports = router
