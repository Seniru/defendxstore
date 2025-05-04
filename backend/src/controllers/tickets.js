const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const Ticket = require("../models/Ticket")
const User = require("../models/User")

//get all tickets
const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({})
            .populate({ path: "user", select: "username email contactNumber" })
            .exec()
        return createResponse(res, StatusCodes.OK, tickets)
    } catch (error) {
        next(error)
    }
}
//create ticket
const createTickets = async (req, res, next) => {
    try {
        const { title, content, type } = req.body
        const user = await User.findOne({ username: req.user.username }).exec()

        const ticket = new Ticket({
            title,
            content,
            type,
            date: Date.now(),
            ticketstatus: "open",
            user: user._id,
        })
        await ticket.save()
        return createResponse(res, StatusCodes.CREATED, ticket)
    } catch (error) {
        next(error)
    }
}
//get ticket by Id
const getTicket = async (req, res, next) => {
    try {
        const user = req.user

        const { ticketId } = req.params
        const ticket = await Ticket.findById(ticketId)
            .populate({ path: "user", select: "username email contactNumber" })
            .exec()
        return createResponse(res, StatusCodes.OK, ticket)
    } catch (error) {
        next(error)
    }
}
//edit ticket
const editTicket = async (req, res, next) => {
    try {
        const { title, content, type } = req.body
        const user = req.user
        console.log(user)
        const { id } = req.params
        const ticket = await Ticket.findOneAndUpdate({ _id: id }, { title, content, type }).exec()
        if (!ticket) return createResponse(res, StatusCodes.NOT_FOUND, "Ticket not found")
        return createResponse(res, StatusCodes.OK, ticket)
    } catch (error) {
        next(error)
    }
}
//delete ticket
const deleteTicket = async (req, res, next) => {
    try {
        const user = req.user
        console.log(user)
        const { ticketId } = req.params
        const ticket = await Ticket.findOneAndDelete({ _id: ticketId }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        return createResponse(res, StatusCodes.OK, ticket)
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
