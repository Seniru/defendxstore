const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Order = require("../src/models/Order")
const User = require("../src/models/User")
const Item = require("../src/models/Item")

const { populateItems, populateUsers, populateOrders } = require("../src/extras/populate")

const prepareData = async () => {
    await Order.deleteMany({})
    await User.deleteMany({})
    await Item.deleteMany({})
    await populateItems()
    await populateUsers()
    await populateOrders()
}

describe("Sales", () => {
    before(async () => {
        await prepareData()
    })

    after(async () => {
        await Order.deleteMany({})
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    describe("GET /api/sales", () => {
        let user1Token
        let adminToken

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await Item.deleteMany({})
            await User.deleteMany({})
        })

        it("should display all sales for the admin", async () => {
            const res = await request
                .get("/api/sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.equal(res.body.body.length, 2)
            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/sales").expect(401)
        })

        it("should return an error if the user is not an admin", async () => {
            await request.get("/api/sales").set("Authorization", `Bearer ${user1Token}`).expect(403)
        })

        it("should return cost data if metric is expenses", async () => {
            const res = await request
                .get("/api/sales?metric=expenses")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].salesData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return profit data if metric is revenue", async () => {
            const res = await request
                .get("/api/sales?metric=revenue")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].salesData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return sales data if metric is sales", async () => {
            const res = await request
                .get("/api/sales?metric=sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return expected sales data if metric is expected_sales", async () => {
            const res = await request
                .get("/api/sales?metric=expected_sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].salesData == null)
        })

        it("should return an error if the metric is invalid", async () => {
            await request
                .get("/api/sales?metric=invalid")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return sales according to the period when given as words (daily, monthly)", async () => {
            for (let period of ["daily", "weekly", "monthly", "yearly"]) {
                const res = await request
                    .get(`/api/sales?period=${period}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200)

                assert.ok(Array.isArray(res.body.body[1].salesData))
                assert.ok(Array.isArray(res.body.body[1].costData))
                assert.ok(Array.isArray(res.body.body[1].profitData))
                assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
            }
        })

        it("should return sales according to the period when given as numbers (1d, 3m)", async () => {
            for (let period of ["1d", "7d", "1m", "4m", "1y"]) {
                const res = await request
                    .get(`/api/sales?period=${period}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200)

                assert.ok(Array.isArray(res.body.body[1].salesData))
                assert.ok(Array.isArray(res.body.body[1].costData))
                assert.ok(Array.isArray(res.body.body[1].profitData))
                assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
            }
        })

        it("should return an error if the period is invalid (words)", async () => {
            await request
                .get("/api/sales?period=invalid")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return an error if the period is invalid (numbers)", async () => {
            await request
                .get("/api/sales?period=1w")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)

            await request
                .get("/api/sales?period=-3d")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return sales data from a date range", async () => {
            const today = new Date()
            const monthFromToday = new Date(today)
            monthFromToday.setMonth(today.getMonth() + 1)

            const res = await request
                .get(`/api/sales?startDate=2023-01-01&endDate=${monthFromToday.toISOString()}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
        })
    })

    describe("GET /api/sales/monthly", () => {
        let user1Token
        let adminToken
        let orderId

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await Item.deleteMany({})
            await User.deleteMany({})
        })

        it("should return monthly sales data for the admin", async () => {
            const res = await request
                .get("/api/sales/monthly")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/sales/monthly").expect(401)
        })

        it("should return an error if the user is not an admin", async () => {
            await request
                .get("/api/sales/monthly")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return monthly sales data for a specific date range", async () => {
            const today = new Date()
            const monthFromToday = new Date(today)
            monthFromToday.setMonth(today.getMonth() + 1)

            const res = await request
                .get(
                    `/api/sales/monthly?startDate=2023-01-01&endDate=${monthFromToday.toISOString()}`,
                )
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
        })

        it("should return sales data if metric is sales", async () => {
            const res = await request
                .get("/api/sales/monthly?metric=sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].salesData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return sales data if metric is expenses", async () => {
            const res = await request
                .get("/api/sales/monthly?metric=expenses")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].costData))
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].salesData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return sales data if metric is revenue", async () => {
            const res = await request
                .get("/api/sales/monthly?metric=revenue")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].profitData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].salesData == null)
            assert.ok(res.body.body[1].expectedSalesData == null)
        })

        it("should return sales data if metric is expected_sales", async () => {
            const res = await request
                .get("/api/sales/monthly?metric=expected_sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body[1].expectedSalesData))
            assert.ok(res.body.body[1].costData == null)
            assert.ok(res.body.body[1].profitData == null)
            assert.ok(res.body.body[1].salesData == null)
        })
    })

    describe("GET /api/sales/compare", () => {
        let user1Token
        let adminToken

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@defendxstore.com",
                password: "pass",
            })

            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await Item.deleteMany({})
            await User.deleteMany({})
        })

        it("should return sales data for the admin with metric sales", async () => {
            const res = await request
                .get("/api/sales/compare?metric=sales&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.partialDeepStrictEqual(Object.keys(res.body.body[1]), ["Item 1", "Item 2"])
            assert.ok(Array.isArray(res.body.body[1]["Item 1"]))
            assert.ok(Array.isArray(res.body.body[1]["Item 2"]))
        })

        it("should return sales data for the admin with metric expenses", async () => {
            const res = await request
                .get("/api/sales/compare?metric=expenses&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.partialDeepStrictEqual(Object.keys(res.body.body[1]), ["Item 1", "Item 2"])
            assert.ok(Array.isArray(res.body.body[1]["Item 1"]))
            assert.ok(Array.isArray(res.body.body[1]["Item 2"]))
        })

        it("should return sales data for the admin with metric revenue", async () => {
            const res = await request
                .get("/api/sales/compare?metric=revenue&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.partialDeepStrictEqual(Object.keys(res.body.body[1]), ["Item 1", "Item 2"])
            assert.ok(Array.isArray(res.body.body[1]["Item 1"]))
            assert.ok(Array.isArray(res.body.body[1]["Item 2"]))
        })

        it("should return sales data for the admin with metric expected_sales", async () => {
            const res = await request
                .get("/api/sales/compare?metric=expected_sales&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.partialDeepStrictEqual(Object.keys(res.body.body[1]), ["Item 1", "Item 2"])
            assert.ok(Array.isArray(res.body.body[1]["Item 1"]))
            assert.ok(Array.isArray(res.body.body[1]["Item 2"]))
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/sales/compare?metric=sales&items=Item%201,Item%202").expect(401)
        })

        it("should return an error if the user is not an admin", async () => {
            await request
                .get("/api/sales/compare?metric=sales&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return an error if the metric is invalid", async () => {
            await request
                .get("/api/sales/compare?metric=invalid&items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return an error if the items are not provided", async () => {
            await request
                .get("/api/sales/compare?metric=sales")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return an error if metric is not provided", async () => {
            await request
                .get("/api/sales/compare?items=Item%201,Item%202")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return an error if the items are empty", async () => {
            await request
                .get("/api/sales/compare?metric=sales&items=,,,,")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })

        it("should return items in a date range", async () => {
            const today = new Date()
            const monthFromToday = new Date(today)
            monthFromToday.setMonth(today.getMonth() + 1)

            const res = await request
                .get(
                    `/api/sales/compare?metric=sales&dateFrom=2023-01-01&dateTo=${monthFromToday.toISOString()}&items=Item%201,Item%202`,
                )
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
            assert.equal(res.body.body.length, 2)
            assert.partialDeepStrictEqual(Object.keys(res.body.body[1]), ["Item 1", "Item 2"])
            assert.ok(Array.isArray(res.body.body[1]["Item 1"]))
            assert.ok(Array.isArray(res.body.body[1]["Item 2"]))
        })
    })

    describe("GET /api/sales/supplyMetrics", () => {
        let user1Token
        let adminToken

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await Item.deleteMany({})
            await User.deleteMany({})
        })

        it("should return supply metrics for the admin", async () => {
            const res = await request
                .get("/api/sales/supplyMetrics")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/sales/supplyMetrics").expect(401)
        })

        it("should return an error if the user is not an admin", async () => {
            await request
                .get("/api/sales/supplyMetrics")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })
    })
})
