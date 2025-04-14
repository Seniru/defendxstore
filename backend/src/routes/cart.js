const express = require("express")
const router = express.Router({ mergeParams: true })

const { getCart, addItem, emptyCart } = require("../controllers/cart")
const { requireRole, roles } = require("../middlewares/auth")

router.get("/", requireRole(roles.USER), getCart)
router.post("/", requireRole(roles.USER), addItem)
router.delete("/", requireRole(roles.USER), emptyCart)

module.exports = router
