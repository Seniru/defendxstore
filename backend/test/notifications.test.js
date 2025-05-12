const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const User = require("../src/models/User")
const request = supertest(app)

const salt = bcrypt.genSaltSync(10)

const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: bcrypt.hashSync("Password@123", salt),
    notifications: [{ message: "Notification 1" }, { message: "Notification 2" }],
    role: 1 << 0,
}

const prepareData = async () => {
    await User.deleteMany({})
    const user1 = await User.create(userData)
}

describe("Notifications", () => {
    let testUser = null

    before(async () => {
        await User.deleteMany({})
    })

    after(async () => {
        await User.deleteMany({})
    })

    describe("GET /api/notifications", () => {
        let user1Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should return all notifications for the user", async () => {
            const res = await request
                .get("/api/notifications")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.strictEqual(res.body.body.notifications.length, 2)
            assert.strictEqual(res.body.body.notifications[0].message, "Notification 1")
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/notifications").expect(401)
        })
    })

    describe("DELETE /api/notifications", () => {
        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should delete all notifications for the user", async () => {
            await request
                .delete("/api/notifications")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            const user = await User.findOne({})
            assert.strictEqual(user.notifications.length, 0)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.delete("/api/notifications").expect(401)
        })
    })

    describe("DELETE /api/notifications/:id", () => {
        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should delete a specific notification by ID", async () => {
            await request
                .delete("/api/notifications/0")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            const user = await User.findOne({})
            assert.strictEqual(user.notifications.length, 1)
            assert.strictEqual(user.notifications[0].message, "Notification 2")
        })

        it("should return an error for an invalid ID", async () => {
            await request
                .delete("/api/notifications/invalid")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(400)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.delete("/api/notifications/0").expect(401)
        })
    })
})

