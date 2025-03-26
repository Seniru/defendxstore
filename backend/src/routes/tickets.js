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

router.get("/", getAllTickets)
router.post("/", requireRole(roles.USER), createTickets)
router.get("/:ticketId", getTicket)
router.put("/:ticketId", editTicket)
router.delete("/:ticketId", deleteTicket)
module.exports = router
