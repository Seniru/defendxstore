const express = require("express")
const router = express.Router()

const { verify, login, initiateVerification } = require("../controllers/auth")
const { requireRole, roles } = require("../middlewares/auth")

router.post("/login", login)
router.put("/verify", requireRole(roles.USER), verify)
router.post("/verify", requireRole(roles.USER), initiateVerification)

module.exports = router
