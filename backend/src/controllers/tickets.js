const { StatusCodes } = require("http-status-codes")
const createResponse = require("../utils/createResponse")
const Ticket = require("../models/Ticket")
const User = require("../models/User")
const SupportReport = require("../models/reports/SupportReport")
const ExcelJS = require("exceljs")
const { addTable, createAttachment, columns } = require("../utils/spreadsheets")

const getAllTicketsSpreadsheet = async (res, tickets) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Tickets")

    worksheet.columns = columns.tickets

    addTable(
        worksheet,
        [
            "",
            "Title",
            "Username",
            "Type",
            "Status",
            "User email",
            "User contact numbers",
            "Content",
        ],
        tickets.map((ticket) => [
            ticket._id,
            ticket.title,
            ticket.user?.username || "Deleted account",
            ticket.type,
            ticket.ticketstatus,
            ticket.user?.email || "",
            (ticket.user?.contactNumber || []).join(", "),
            ticket.content,
        ]),
    )

    return createAttachment(workbook, res)
}

//get all tickets
const getAllTickets = async (req, res, next) => {
    try {
        const { status, q, category, downloadSheet } = req.query
        const user = req.user
        const fromUser = req.query.fromUser || "all"

        if (status && !["open", "closed"].includes(status))
            return createResponse(res, StatusCodes.BAD_REQUEST, "Invalid status")

        const query = { title: { $regex: q || "", $options: "i" } }
        if (category) query.type = category
        if (status) query.ticketstatus = status

        if (fromUser == "all" && !user.roles.includes("SUPPORT_AGENT"))
            return createResponse(
                res,
                StatusCodes.FORBIDDEN,
                "You are not authorized to view all tickets",
            )

        if (fromUser != "all") query.user = (await User.findOne({ username: fromUser }).exec())._id

        const tickets = await Ticket.find(query)
            .populate({ path: "user", select: "username email contactNumber" })
            .exec()

        if (downloadSheet == "true") return getAllTicketsSpreadsheet(res, tickets)

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

        await SupportReport.create({
            user: user._id,
            action: SupportReport.actions.createTicket,
            data: { ticketId: ticket._id },
        })

        await user.incrementProgress("supportSeeker")

        return createResponse(res, StatusCodes.CREATED, ticket)
    } catch (error) {
        next(error)
    }
}
//get ticket by Id
const getTicket = async (req, res, next) => {
    try {
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
        const user = await User.findOne({ username: req.user.username }).exec()
        const { ticketId } = req.params
        const ticket = await Ticket.findOneAndUpdate(
            { _id: ticketId },
            { title, content, type },
        ).exec()
        if (!ticket) return createResponse(res, StatusCodes.NOT_FOUND, "Ticket not found")

        await SupportReport.create({
            user: user._id,
            action: SupportReport.actions.editTicket,
            data: { ticketId: ticket._id },
        })
        return createResponse(res, StatusCodes.OK, ticket)
    } catch (error) {
        next(error)
    }
}
//delete ticket
const deleteTicket = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        const { ticketId } = req.params
        const ticket = await Ticket.findOneAndDelete({ _id: ticketId }).exec()
        if (!user) return createResponse(res, StatusCodes.NOT_FOUND, "User not found")
        await SupportReport.create({
            user: user._id,
            action: SupportReport.actions.deleteTicket,
            data: { ticketId: ticket._id },
        })
        return createResponse(res, StatusCodes.OK, ticket)
    } catch (error) {
        next(error)
    }
}

const resolveTicket = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec()
        const { ticketId } = req.params
        const ticket = await Ticket.findByIdAndUpdate(ticketId, { ticketstatus: "closed" }).exec()
        if (!ticket) return createResponse(res, StatusCodes.NOT_FOUND, "Ticket not found")

        const ticketOwner = await User.findById(ticket.user).exec()
        await ticketOwner.pushNotification(
            `Your ticket (#${ticketId}) has been successfully resolved by our support team.`,
        )

        await SupportReport.create({
            user: user._id,
            action: SupportReport.actions.resolveTicket,
            data: { ticketId: ticket._id },
        })
        return createResponse(res, StatusCodes.OK, "Ticket resolved")
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
    resolveTicket,
}
