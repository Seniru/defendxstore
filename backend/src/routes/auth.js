const express = require("express")
const router = express.Router()

const { verify, login } = require("../controllers/auth")
const { requireRole, roles } = require("../middlewares/auth")

router.post("/login", login)
router.put("/verify", requireRole(roles.USER), verify)

module.exports = router
