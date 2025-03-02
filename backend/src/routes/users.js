const express = require("express")
const router = express.Router()

const { createUser, getUserProfileImage } = require("../controllers/users")

router.get("/", (req, res) => res.send("Test"))
router.post("/", createUser)
router.get("/:username/profileImage", getUserProfileImage)

module.exports = router
