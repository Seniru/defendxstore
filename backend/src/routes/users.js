const express = require("express")
const router = express.Router()

const { createUser } = require("../controllers/users")

router.get("/", (req, res) => res.send("Test"))
router.post("/", createUser)

module.exports = router
