const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const { getPerks } = require("../controllers/perks")

router.get("/", requireRole(roles.USER), getPerks)

module.exports = router
