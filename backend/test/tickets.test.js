const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Ticket = require("../src/models/Ticket")
const User = require("../src/models/User")

const salt = bcrypt.genSaltSync(10)

const agentData = {
    username: "agent",
    password: bcrypt.hashSync("Agentpassword@123", salt),
    email: "agent@example.com",
    role: (1 << 2) | 1,
}

const user1Data = {
    username: `user1`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user1@example.com`,
    role: 1 << 0,
}

const user2Data = {
    username: `user2`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user2@example.com`,
    role: 1 << 0,
}

const prepareData = async () => {
    await User.deleteMany({})
    const agent = await User.create(agentData)
    const user1 = await User.create(user1Data)
    const user2 = await User.create(user2Data)

    const tickets = Array.from({ length: 6 }).map((_, i) => ({
        type: "Bug",
        date: new Date(),
        title: `title-0000${i + 1}`,
        content: `content 0000${i + 1}`,
        ticketstatus: i % 2 === 0 ? "open" : "closed",
        user: (i % 2 == 0 ? user1 : user2)._id,
    }))

    await Ticket.insertMany(tickets)
}

describe("Tickets", () => {
    before(async () => {
        await Ticket.deleteMany({})
    })

    after(async () => {
        await Ticket.deleteMany({})
    })

    describe("GET /api/tickets", () => {
        let userToken, agentToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })

            // log in as an agent
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent@example.com",
                password: "Agentpassword@123",
            })

            agentToken = agentLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request.get("/api/tickets").expect(401)
        })

        it("Should return all tickets created by the user", async () => {
            const user = await User.findOne({ username: "user1" }).exec()
            const res = await request
                .get(`/api/tickets?fromUser=user1`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)

            // All ticket count are 6, tickets created by user1 and user2 are 3 each
            assert.strictEqual(res.body.body.length, 3)
            for (let i = 0; i < res.body.body.length; i++) {
                assert.strictEqual(res.body.body[i].user._id, user._id.toString())
            }
        })

        it("Should return forbidden if user tries to access all tickets", async () => {
            await request
                .get(`/api/tickets?fromUser=all`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)

            await request
                .get(`/api/tickets`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)
        })

        it("Should return forbidden if user tries to access tickets of other users", async () => {
            await request
                .get(`/api/tickets?fromUser=user2`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)
        })

        it("Should return all tickets if user is support agent", async () => {
            const res = await request
                .get(`/api/tickets?fromUser=all`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            // All ticket count are 6, tickets created by user1 and user2 are 3 each
            assert.strictEqual(res.body.body.length, 6)
        })

        it("Should return open tickets if status is open", async () => {
            const res = await request
                .get(`/api/tickets?status=open`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 3)
            for (let i = 0; i < res.body.body.length; i++) {
                assert.strictEqual(res.body.body[i].ticketstatus, "open")
            }
        })

        it("Should return closed tickets if status is closed", async () => {
            const res = await request
                .get(`/api/tickets?status=closed`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 3)
            for (let i = 0; i < res.body.body.length; i++) {
                assert.strictEqual(res.body.body[i].ticketstatus, "closed")
            }
        })

        it("Should return tickets with title matching the query", async () => {
            const res = await request
                .get(`/api/tickets?q=title-00001`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 1)
            assert.strictEqual(res.body.body[0].title, "title-00001")
        })

        it("Should return tickets with type matching the query", async () => {
            const res = await request
                .get(`/api/tickets?category=Bug`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 6)
            for (let i = 0; i < res.body.body.length; i++) {
                assert.strictEqual(res.body.body[i].type, "Bug")
            }
        })
    })

    describe("POST /api/tickets", () => {
        let userToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request.post("/api/tickets").expect(401)
        })

        it("Should create a new ticket", async () => {
            const res = await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test Ticket",
                    content: "This is a test ticket",
                    type: "Inquiry",
                })
                .expect(201)

            assert.strictEqual(res.body.body.title, "Test Ticket")
            assert.strictEqual(res.body.body.content, "This is a test ticket")
            assert.strictEqual(res.body.body.type, "Inquiry")
        })

        it("Should return 400 if required fields are missing", async () => {
            await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test Ticket",
                    content: "This is a test ticket",
                })
                .expect(400)

            await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    type: "Inquiry",
                    content: "This is a test ticket",
                })
                .expect(400)

            await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test Ticket",
                    type: "Inquiry",
                })
                .expect(400)
        })

        it("Should return 400 if title is too short", async () => {
            await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test",
                    content: "This is a test ticket",
                    type: "Inquiry",
                })
                .expect(400)
        })

        it("Should return 400 if content is too short", async () => {
            await request
                .post("/api/tickets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test Ticket",
                    content: "Test",
                    type: "Inquiry",
                })
                .expect(400)
        })
    })

    describe("GET /api/tickets/:ticketId", () => {
        let userToken, ticketId

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request.get("/api/tickets/123456789012").expect(401)
        })

        it("Should return ticket details", async () => {
            const ticket = await Ticket.findOne({}).exec()
            ticketId = ticket._id

            const res = await request
                .get(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)

            assert.strictEqual(res.body.body._id, ticketId.toString())
            assert.strictEqual(res.body.body.title, ticket.title)
            assert.strictEqual(res.body.body.content, ticket.content)
        })

        it("Should return 404 if ticket not found", async () => {
            const fakeId = new mongoose.Types.ObjectId()

            await request
                .get(`/api/tickets/${fakeId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(404)
        })
    })

    describe("PUT /api/tickets/:ticketId", () => {
        let userToken, ticketId

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            userToken = loginResponse.body.body.token
            const ticket = await Ticket.findOne({}).exec()
            ticketId = ticket._id
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request
                .put(`/api/tickets/${ticketId}`)
                .send({
                    title: "Updated Ticket",
                    content: "This is an updated ticket",
                    type: "Inquiry",
                })
                .expect(401)
        })

        it("Should update the ticket", async () => {
            const res = await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Ticket",
                    content: "This is an updated ticket",
                    type: "Inquiry",
                })
                .expect(200)

            assert.strictEqual(res.body.body.title, "Updated Ticket")
            assert.strictEqual(res.body.body.content, "This is an updated ticket")
        })

        it("Should return 400 if required fields are missing", async () => {
            await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Ticket",
                    content: "This is an updated ticket",
                })
                .expect(400)

            await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    type: "Inquiry",
                    content: "This is an updated ticket",
                })
                .expect(400)

            await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Ticket",
                    type: "Inquiry",
                })
                .expect(400)
        })

        it("Should return 400 if title is too short", async () => {
            await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Test",
                    content: "This is an updated ticket",
                    type: "Inquiry",
                })
                .expect(400)
        })

        it("Should return 400 if content is too short", async () => {
            await request
                .put(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Ticket",
                    content: "Test",
                    type: "Inquiry",
                })
                .expect(400)
        })

        it("Should return 404 if ticket not found", async () => {
            const fakeId = new mongoose.Types.ObjectId()

            await request
                .put(`/api/tickets/${fakeId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Ticket",
                    content: "This is an updated ticket",
                    type: "Inquiry",
                })
                .expect(404)
        })
    })

    describe("DELETE /api/tickets/:ticketId", () => {
        let userToken, ticketId

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            userToken = loginResponse.body.body.token
            const ticket = await Ticket.findOne({}).exec()
            ticketId = ticket._id
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request.delete(`/api/tickets/${ticketId}`).expect(401)
        })

        it("Should delete the ticket", async () => {
            const res = await request
                .delete(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)

            assert.strictEqual(res.body.body._id, ticketId.toString())
        })

        it("Should return 404 if ticket not found", async () => {
            const fakeId = new mongoose.Types.ObjectId()

            await request
                .delete(`/api/tickets/${fakeId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(404)
        })
    })

    describe("PATCH /api/tickets/:ticketId", () => {
        let agentToken, ticketId

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "agent@example.com",
                password: "Agentpassword@123",
            })
            agentToken = loginResponse.body.body.token
            const ticket = await Ticket.findOne({}).exec()
            ticketId = ticket._id
        })

        after(async () => {
            await User.deleteMany()
            await Ticket.deleteMany()
        })

        it("Should return unauthorized if not logged in", async () => {
            await request
                .patch(`/api/tickets/${ticketId}`)
                .send({
                    ticketstatus: "closed",
                })
                .expect(401)
        })

        it("Should resolve the ticket", async () => {
            const res = await request
                .patch(`/api/tickets/${ticketId}`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({
                    ticketstatus: "closed",
                })
                .expect(200)

            const ticket = await Ticket.findById(ticketId).exec()
            assert.strictEqual(ticket.ticketstatus, "closed")
        })

        it("Should return 404 if ticket not found", async () => {
            const fakeId = new mongoose.Types.ObjectId()

            await request
                .patch(`/api/tickets/${fakeId}`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({
                    ticketstatus: "closed",
                })
                .expect(404)
        })
    })
})
