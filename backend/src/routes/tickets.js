const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const {
    getAllTickets,
    createTickets,
    getTicket,
    editTicket,
    deleteTicket,
} = require("../controllers/tickets")

router.get("/", requireRole(roles.USER), getAllTickets)
router.post("/", requireRole(roles.USER), createTickets)
router.get("/:ticketId", requireRole(roles.USER), getTicket)
router.put("/:ticketId", requireRole(roles.USER), editTicket)
router.delete("/:ticketId", requireRole(roles.USER), deleteTicket)
module.exports = router
