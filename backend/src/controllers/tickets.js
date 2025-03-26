const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const Ticket = require("../models/Ticket")

const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({})
        return createResponse(res, StatusCodes.OK, tickets)
    } catch (error) {
        next(error)
    }
}

const createTickets = async (req, res, next) => {
    try {
        const { title, content, type } = req.body
        const user = req.user
        const ticket = new Ticket({
            title,
            content,
            type,
            date: Date.now(),
            ticketstatus: "open",
            username: user.username,
        })
        await ticket.save()
        return createResponse(res, StatusCodes.CREATED, "Created")
    } catch (error) {
        next(error)
    }
}

const getTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params
        const ticket = await Ticket.find({ _id: ticketId }, {}).exec()
        return createResponse(res, StatusCodes.OK, ticket)
    } catch (error) {
        next(error)
    }
}

const editTicket = async (req, res, next) => {
    try {
        const { title, content, type } = req.body
        const { ticketId } = req.params
        const user = req.user
        const ticket = await Ticket.findOneAndUpdate(
            { _id: ticketId },
            { title, content, type },
        ).exec()
        if (!ticket) return createResponse(res, StatusCodes.NOT_FOUND, "Ticket not found")
        return createResponse(res, StatusCodes.OK, "Ticket updated")
    } catch (error) {
        next(error)
    }
}

const deleteTicket = async (req, res, next) => {
    try {
        const user = req.user
        const { ticketId } = req.params
        const ticket = await Ticket.findOneAndDelete({ _id: ticketId }).exec()
        if (!ticket) return createResponse(res, StatusCodes.NOT_FOUND, "Ticket not found")
        return createResponse(res, StatusCodes.OK, "Ticket deleted")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllTickets,
    createTickets,
    getTicket,
    editTicket,
    deleteTicket,
}
