const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const { getAllUsers, getUser, createUser, getUserProfileImage } = require("../controllers/users")

router.get("/", requireRole(roles.ADMIN), getAllUsers)
router.post("/", createUser)
router.get("/:username", requireRole(roles.USER), getUser)
router.get("/:username/profileImage", getUserProfileImage)

module.exports = router
