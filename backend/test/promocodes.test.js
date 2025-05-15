const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Promocodes = require("../src/models/Promocodes")
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
    await Promocodes.deleteMany({})
    const admin = await User.create(adminData)
    const user1 = await User.create(user1Data)

    const promocodes = Array.from({ length: 5 }).map((_, i) => ({
        promocode: `TESTCODE${i}`,
        discount: i * 2,
        validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }))

    await Promocodes.insertMany(promocodes)
}

describe("Promocodes", () => {
    before(async () => {
        await Promocodes.deleteMany({})
    })

    after(async () => {
        await Promocodes.deleteMany({})
    })

    describe("GET /api/promo", () => {
        let adminToken, userToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })

            // log in as an agent
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })

            adminToken = adminLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await Promocodes.deleteMany({})
        })

        it("should return all promocodes", async () => {
            const res = await request
                .get("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.body.length, 5)
        })

        it("should return 403 for non-admin user", async () => {
            await request.get("/api/promo").set("Authorization", `Bearer ${userToken}`).expect(403)
        })

        it("should return 401 for unauthenticated user", async () => {
            await request.get("/api/promo").expect(401)
        })
    })

    describe("POST /api/promo", () => {
        let adminToken, userToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            // log in as an admin
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            adminToken = adminLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await Promocodes.deleteMany({})
        })

        it("should create a new promocode", async () => {
            const newPromocode = {
                promocode: "NEWPROMOCODE",
                discount: 10,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            const res = await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newPromocode)
                .expect(201)

            assert.strictEqual(res.status, 201)
            assert.strictEqual(res.body.body.promocode, newPromocode.promocode)
        })

        it("should return 403 for non-admin user", async () => {
            const newPromocode = {
                promocode: "NEWPROMOCODE",
                discount: 10,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${userToken}`)
                .send(newPromocode)
                .expect(403)
        })

        it("should return 401 for unauthenticated user", async () => {
            const newPromocode = {
                promocode: "NEWPROMOCODE",
                discount: 10,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request.post("/api/promo").send(newPromocode).expect(401)
        })

        it("should return 400 for invalid promocode data", async () => {
            const invalidPromocode = {
                promocode: "NP",
                discount: -10,
                validuntil: new Date(Date.now() - 1000 * 60 * 60 * 24),
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(invalidPromocode)
                .expect(400)
        })

        it("should return 400 for duplicate promocode", async () => {
            const duplicatePromocode = {
                promocode: "TESTCODE0",
                discount: 10,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(duplicatePromocode)
                .expect(400)
        })

        it("should return 400 for missing required fields", async () => {
            const invalidPromocode = {
                promocode: "NP",
                discount: 10,
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(invalidPromocode)
                .expect(400)
        })

        it("should return 400 for invalid date format", async () => {
            const invalidPromocode = {
                promocode: "NP",
                discount: 10,
                validuntil: "invalid-date",
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(invalidPromocode)
                .expect(400)
        })

        it("should return 400 for invalid discount value", async () => {
            const invalidPromocode = {
                promocode: "NP",
                discount: "invalid-discount",
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .post("/api/promo")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(invalidPromocode)
                .expect(400)
        })
    })

    describe("PUT /api/promo/:promocode", () => {
        let adminToken, userToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            // log in as an admin
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })

            adminToken = adminLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await Promocodes.deleteMany({})
        })

        it("should update an existing promocode", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: 20,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            const res = await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(200)

            assert.strictEqual(res.status, 200)
            assert.strictEqual(res.body.body.discount, updatedPromocode.discount)
        })
        it("should return 403 for non-admin user", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: 20,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${userToken}`)
                .send(updatedPromocode)
                .expect(403)
        })

        it("should return 401 for unauthenticated user", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: 20,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request.put("/api/promo/TESTCODE0").send(updatedPromocode).expect(401)
        })

        it("should return 404 for non-existing promocode", async () => {
            const updatedPromocode = {
                promocode: "NONEXISTINGCODE",
                discount: 20,
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .put("/api/promo/NONEXISTINGCODE")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(404)
        })

        it("should return 400 for invalid promocode data", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: -10,
                validuntil: new Date(Date.now() - 1000 * 60 * 60 * 24),
            }

            await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(400)
        })

        it("should return 400 for missing required fields", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: 20,
            }

            await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(400)
        })

        it("should return 400 for invalid date format", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: 20,
                validuntil: "invalid-date",
            }

            await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(400)
        })

        it("should return 400 for invalid discount value", async () => {
            const updatedPromocode = {
                promocode: "TESTCODE0",
                discount: "invalid-discount",
                validuntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
            }

            await request
                .put("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedPromocode)
                .expect(400)
        })
    })

    describe("DELETE /api/promo/:promocode", () => {
        let adminToken, userToken

        before(async () => {
            await prepareData()
            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            // log in as an admin
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            adminToken = adminLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await Promocodes.deleteMany({})
        })

        it("should delete an existing promocode", async () => {
            const res = await request
                .delete("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            assert.strictEqual(res.status, 200)
            const newPromocodeCount = await Promocodes.countDocuments({})
            assert.strictEqual(newPromocodeCount, 4)
        })

        it("should return 403 for non-admin user", async () => {
            await request
                .delete("/api/promo/TESTCODE0")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)
        })

        it("should return 401 for unauthenticated user", async () => {
            await request.delete("/api/promo/TESTCODE0").expect(401)
        })

        it("should return 404 for non-existing promocode", async () => {
            await request
                .delete("/api/promo/NONEXISTINGCODE")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404)
        })
    })
})
