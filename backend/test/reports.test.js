const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const User = require("../src/models/User")
const UserReport = require("../src/models/reports/UserReport")
const OrderReport = require("../src/models/reports/OrderReport")
const SupportReport = require("../src/models/reports/SupportReport")

const salt = bcrypt.genSaltSync(10)

const adminData = {
    username: "admin",
    password: bcrypt.hashSync("Adminpassword@123", salt),
    email: "admin@example.com",
    role: (1 << 3) | 1,
}

const supportAgentData = {
    username: "supportagent",
    password: bcrypt.hashSync("Supportpassword@123", salt),
    email: "support@example.com",
    role: (1 << 2) | 1,
}

const deliveryAgentData = {
    username: "deliveryagent",
    password: bcrypt.hashSync("Deliverypassword@123", salt),
    email: "agent@example.com",
    role: (1 << 1) | 1,
}

const user1Data = {
    username: `user1`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user1@example.com`,
    role: 1 << 0,
}

const prepareData = async () => {
    await User.deleteMany({})
    await UserReport.deleteMany({})
    await OrderReport.deleteMany({})
    await SupportReport.deleteMany({})

    const admin = await User.create(adminData)
    const supportAgent = await User.create(supportAgentData)
    const deliveryAgent = await User.create(deliveryAgentData)
    const user1 = await User.create(user1Data)

    const userReports = []
    for (let i = 0; i < 3; i++) {
        userReports.push({
            user: admin._id,
            action: UserReport.actions.login,
            timestamp: new Date(),
            data: {},
        })
    }
    await UserReport.insertMany(userReports)
    const orderReports = []
    for (let i = 0; i < 3; i++) {
        orderReports.push({
            user: admin._id,
            action: OrderReport.actions.createOrder,
            timestamp: new Date(),
            data: {},
        })
    }
    await OrderReport.insertMany(orderReports)
    const supportReports = []
    for (let i = 0; i < 3; i++) {
        supportReports.push({
            user: admin._id,
            action: SupportReport.actions.createTicket,
            timestamp: new Date(),
            data: {},
        })
    }
    await SupportReport.insertMany(supportReports)
}

describe("Reports", () => {
    before(async () => {
        await prepareData()
    })

    after(async () => {
        await User.deleteMany({})
        await UserReport.deleteMany({})
        await OrderReport.deleteMany({})
        await SupportReport.deleteMany({})
    })

    describe("GET /api/reports/users", () => {
        let adminToken, user1Token
        before(async () => {
            await prepareData()
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            adminToken = adminLoginResponse.body.body.token
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await UserReport.deleteMany({})
            await OrderReport.deleteMany({})
            await SupportReport.deleteMany({})
        })

        it("should return all user reports", async () => {
            const res = await request
                .get("/api/reports/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 5)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return user reports filtered by action", async () => {
            const res = await request
                .get("/api/reports/users?action=login")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 5)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return user reports filtered by date", async () => {
            const fromDate = new Date()
            const toDate = new Date()
            fromDate.setDate(fromDate.getDate() - 1)
            toDate.setDate(toDate.getDate() + 1)

            const res = await request
                .get(
                    "/api/reports/users?fromDate=" +
                        fromDate.toISOString() +
                        "&toDate=" +
                        toDate.toISOString(),
                )
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 5)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return user reports filtered by user", async () => {
            const res = await request
                .get("/api/reports/users?searchUser=user1")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 1)
            assert.ok(Array.isArray(res.body.body.actions))

            const res2 = await request
                .get("/api/reports/users?searchUser=admin")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res2.body.body.report.length, 4)
        })

        it("should return 401 for unauthorized access", async () => {
            await request.get("/api/reports/users").expect(401)
        })

        it("should return 403 for forbidden access", async () => {
            await request
                .get("/api/reports/users")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return an excel attachment if downloadSheet is true", async () => {
            const res = await request
                .get("/api/reports/users?downloadSheet=true")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(
                res.headers["content-type"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            assert.strictEqual(
                res.headers["content-disposition"],
                'attachment; filename="output.xlsx"',
            )
        })
    })

    describe("GET /api/reports/orders", () => {
        let agentToken, user1Token
        before(async () => {
            await prepareData()
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent@example.com",
                password: "Deliverypassword@123",
            })
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            agentToken = agentLoginResponse.body.body.token
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await UserReport.deleteMany({})
            await OrderReport.deleteMany({})
            await SupportReport.deleteMany({})
        })

        it("should return all orders reports", async () => {
            const res = await request
                .get("/api/reports/orders")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return order reports filtered by action", async () => {
            const res = await request
                .get("/api/reports/orders?action=create-order")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return order reports filtered by date", async () => {
            const fromDate = new Date()
            const toDate = new Date()
            fromDate.setDate(fromDate.getDate() - 1)
            toDate.setDate(toDate.getDate() + 1)

            const res = await request
                .get(
                    "/api/reports/orders?fromDate=" +
                        fromDate.toISOString() +
                        "&toDate=" +
                        toDate.toISOString(),
                )
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return order reports filtered by user", async () => {
            const res = await request
                .get("/api/reports/orders?searchUser=admin")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return 401 for unauthorized access", async () => {
            await request.get("/api/reports/orders").expect(401)
        })

        it("should return 403 for forbidden access", async () => {
            await request
                .get("/api/reports/orders")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return an excel attachment if downloadSheet is true", async () => {
            const res = await request
                .get("/api/reports/orders?downloadSheet=true")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(
                res.headers["content-type"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            assert.strictEqual(
                res.headers["content-disposition"],
                'attachment; filename="output.xlsx"',
            )
        })
    })

    describe("GET /api/reports/support", () => {
        let agentToken, user1Token
        before(async () => {
            await prepareData()
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "support@example.com",
                password: "Supportpassword@123",
            })
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            agentToken = agentLoginResponse.body.body.token
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await UserReport.deleteMany({})
            await OrderReport.deleteMany({})
            await SupportReport.deleteMany({})
        })

        it("should return all support reports", async () => {
            const res = await request
                .get("/api/reports/support")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return support reports filtered by action", async () => {
            const res = await request
                .get("/api/reports/support?action=create-ticket")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return support reports filtered by date", async () => {
            const fromDate = new Date()
            const toDate = new Date()
            fromDate.setDate(fromDate.getDate() - 1)
            toDate.setDate(toDate.getDate() + 1)

            const res = await request
                .get(
                    "/api/reports/support?fromDate=" +
                        fromDate.toISOString() +
                        "&toDate=" +
                        toDate.toISOString(),
                )
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return support reports filtered by user", async () => {
            const res = await request
                .get("/api/reports/support?searchUser=admin")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.report.length, 3)
            assert.ok(Array.isArray(res.body.body.actions))
        })

        it("should return 401 for unauthorized access", async () => {
            await request.get("/api/reports/support").expect(401)
        })

        it("should return 403 for forbidden access", async () => {
            await request
                .get("/api/reports/support")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return an excel attachment if downloadSheet is true", async () => {
            const res = await request
                .get("/api/reports/support?downloadSheet=true")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(
                res.headers["content-type"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            assert.strictEqual(
                res.headers["content-disposition"],
                'attachment; filename="output.xlsx"',
            )
        })
    })
})
