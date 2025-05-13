const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const User = require("../src/models/User")
const ForumThread = require("../src/models/ForumThread")
const { verified } = require("../src/controllers/perks/list")

const salt = bcrypt.genSaltSync(10)

const user1Data = {
    username: `user1`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user1@example.com`,
    role: 1 << 0,
    verified: true,
}

const user2Data = {
    username: `user2`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user2@example.com`,
    role: 1 << 0,
    verified: false,
}

const user3Data = {
    username: `user3`,
    password: bcrypt.hashSync("Testpassword@123", salt),
    email: `user3@example.com`,
    role: 1 << 0,
    verified: true,
}

const prepareData = async () => {
    await User.deleteMany({})
    const user1 = await User.create(user1Data)
    const user2 = await User.create(user2Data)
    const user3 = await User.create(user3Data)
}

describe("Perks", () => {
    before(async () => {
        await prepareData()
    })

    after(async () => {
        await User.deleteMany({})
    })

    describe("GET /api/perks", () => {
        let user1Token

        before(async () => {
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should return all perks for the user", async () => {
            const res = await request
                .get("/api/perks")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.ok(Array.isArray(res.body.body))
        })

        it("should return unauthorized error for unauthenticated user", async () => {
            await request.get("/api/perks").expect(401)
        })
    })

    describe("POST /api/perks/:perk/claim", () => {
        let user1Token, user2Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "user2@example.com",
                password: "Testpassword@123",
            })
            const user3LoginResponse = await request.post("/api/auth/login").send({
                email: "user3@example.com",
                password: "Testpassword@123",
            })

            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
            user3Token = user3LoginResponse.body.body.token

            // create a forum thread (user 1, user 2) to fulfill 'Forum Newbie' perk
            await request.post("/api/forums").set("Authorization", `Bearer ${user1Token}`).send({
                title: "Test thread",
                content: "Test content",
                category: "General",
            })

            await request.post("/api/forums").set("Authorization", `Bearer ${user2Token}`).send({
                title: "Test thread",
                content: "Test content",
                category: "General",
            })
        })

        after(async () => {
            await User.deleteMany({})
            await ForumThread.deleteMany({})
        })

        it("should claim the perk successfully", async () => {
            const res = await request
                .post("/api/perks/forumNewbie/claim")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.strictEqual(res.body.body.type, "promocode")
            assert.strictEqual(typeof res.body.body.promocode.code, "string")
        })

        it("should return error if user is not verified", async () => {
            await request
                .post("/api/perks/forumNewbie/claim")
                .set("Authorization", `Bearer ${user2Token}`)
                .expect(403)
        })

        it("should return error if perk is not found", async () => {
            await request
                .post("/api/perks/invalidPerk/claim")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(404)
        })

        it("should return unauthorized error for unauthenticated user", async () => {
            await request.post("/api/perks/forumNewbie/claim").expect(401)
        })

        it("should return error if progress is not fulfilled", async () => {
            await request
                .post("/api/perks/supportSeeker/claim")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(403)
        })

        it("should return error if perk is already claimed", async () => {
            await request
                .post("/api/perks/forumNewbie/claim")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })
    })
})
