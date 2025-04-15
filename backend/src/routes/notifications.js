const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const {
    getNotifications,
    deleteAllNotifications,
    deleteNotification,
} = require("../controllers/notifications")

router.get("", requireRole(roles.USER), getNotifications)
router.delete("", requireRole(roles.USER), deleteAllNotifications)
router.delete("/:id", requireRole(roles.USER), deleteNotification)

module.exports = router
