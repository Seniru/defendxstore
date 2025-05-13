const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const { getPerks, claimPerk } = require("../controllers/perks")

router.get("/", requireRole(roles.USER), getPerks)
router.post("/:perk/claim", requireRole(roles.USER), claimPerk)

module.exports = router
