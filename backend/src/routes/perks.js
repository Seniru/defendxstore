const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const { getPerks, testPerks, claimPerk } = require("../controllers/perks")

router.get("/", requireRole(roles.USER), getPerks)
router.get("/test", requireRole(roles.USER), testPerks)
router.post("/:perk/claim", requireRole(roles.USER), claimPerk)

module.exports = router
