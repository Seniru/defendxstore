const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Expense = require("../src/models/Expense")
const User = require("../src/models/User")

const salt = bcrypt.genSaltSync(10)

const adminData = {
    username: "admin",
    password: bcrypt.hashSync("Adminpassword@123", salt),
    email: "admin@example.com",
    role: (1 << 3) | 1,
}

const user1Data = {
    username: `user1`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user1@example.com`,
    role: 1 << 0,
}

const prepareData = async () => {
    await User.deleteMany({})
    const admin = await User.create(adminData)
    const user1 = await User.create(user1Data)

    const expenses = Array.from({ length: 6 }).map((_, i) => ({
        date: new Date(),
        amount: Math.floor(Math.random() * 1000),
        category: "Expense Category " + (i % 2 == 0 ? 1 : 2),
        description: `Expense ${i + 1}`,
    }))

    await Expense.insertMany(expenses)
}

describe("Expenses", () => {
    before(async () => {
        await Expense.deleteMany({})
    })

    after(async () => {
        await Expense.deleteMany({})
    })

    describe("GET /api/sales/expenses", () => {
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
            await Expense.deleteMany({})
        })

        it("should return all expenses", async () => {
            const response = await request
                .get("/api/sales/expenses")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(response.body.body.length, 6)
            assert.strictEqual(response.body.body[0].category, "Expense Category 1")
        })

        it("should group expenses by category", async () => {
            const response = await request
                .get("/api/sales/expenses?categories=true")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(response.body.body.categories.length, 2)
            assert.strictEqual(response.body.body.categories[0], "Expense Category 1")
            assert.strictEqual(response.body.body.categories[1], "Expense Category 2")
            assert.strictEqual(response.body.body.expenses.length, 2)
        })

        it("should return expenses filtered by date", async () => {
            const dateFrom = new Date()
            const dateTo = new Date()
            dateFrom.setDate(dateFrom.getDate() - 1)
            dateTo.setDate(dateTo.getDate() + 1)

            const response = await request
                .get(
                    `/api/sales/expenses?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                )
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(response.body.body.length, 6)
        })

        it("should return 401 for unauthorized access", async () => {
            await request.get("/api/sales/expenses").expect(401)
        })

        it("should return 403 for forbidden access", async () => {
            await request
                .get("/api/sales/expenses")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })
    })

    describe("POST /api/sales/expenses", () => {
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
            await Expense.deleteMany({})
        })

        it("should create a new expense", async () => {
            const newExpense = {
                date: new Date(),
                amount: 500,
                category: "New Category",
                description: "New Expense",
            }

            await request
                .post("/api/sales/expenses")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newExpense)
                .expect(200)

            const expenses = await Expense.find({})
            assert.strictEqual(expenses.length, 7)
            assert.strictEqual(expenses[6].category, "New Category")
        })

        it("should return 400 for missing required fields", async () => {
            const newExpense = {
                amount: 500,
                category: "New Category",
            }

            await request
                .post("/api/sales/expenses")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newExpense)
                .expect(400)
        })

        it("should return 401 for unauthorized access", async () => {
            const newExpense = {
                date: new Date(),
                amount: 500,
                category: "New Category",
                description: "New Expense",
            }

            await request.post("/api/sales/expenses").send(newExpense).expect(401)
        })

        it("should return 403 for forbidden access", async () => {
            const newExpense = {
                date: new Date(),
                amount: 500,
                category: "New Category",
                description: "New Expense",
            }

            await request
                .post("/api/sales/expenses")
                .set("Authorization", `Bearer ${user1Token}`)
                .send(newExpense)
                .expect(403)
        })
    })
})
