const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const ForumThread = require("../src/models/ForumThread")
const ForumThreadReply = require("../src/models/ForumThreadReply")
const User = require("../src/models/User")

const salt = bcrypt.genSaltSync(10)

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
    const user1 = await User.create(user1Data)
    const user2 = await User.create(user2Data)

    const threads = Array.from({ length: 6 }).map((_, i) => ({
        title: `Thread 00000${i + 1}`,
        content: `Content for thread ${i + 1}`,
        createdDate: new Date(),
        editedDate: new Date(),
        category: i % 2 == 0 ? "Discussion" : "Other",
        createdUser: (i % 2 == 0 ? user1 : user2)._id,
        replies: [],
    }))
    await ForumThread.insertMany(threads)
    const createdThreads = await ForumThread.find({}).exec()

    const replies = Array.from({ length: 24 }).map((_, i) => ({
        threadId: createdThreads[i % 6]._id,
        content: `Reply 00000${i + 1}`,
        createdDate: new Date(),
        createdUser: (i % 2 == 1 ? user1 : user2)._id,
    }))

    await ForumThreadReply.insertMany(replies)

    const updatedThreads = await Promise.all(
        createdThreads.map(async (thread, i) => {
            thread.replies.push(replies[i * 4]._id)
            thread.replies.push(replies[i * 4 + 1]._id)
            return await thread.save()
        }),
    )
}

describe("Forums", () => {
    before(async () => {
        await ForumThread.deleteMany({})
        await ForumThreadReply.deleteMany({})
    })

    after(async () => {
        await ForumThread.deleteMany({})
        await ForumThreadReply.deleteMany({})
    })

    describe("GET /api/forums/", () => {
        before(async () => {
            await prepareData()
        })

        after(async () => {
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should return all threads", async () => {
            const res = await request.get("/api/forums/").expect(200)
            assert.strictEqual(res.body.body.length, 6)
        })

        it("should return threads with replies", async () => {
            const res = await request.get("/api/forums/").expect(200)
            assert.strictEqual(res.body.body[0].replies.length, 2)
            assert.strictEqual(res.body.body[1].replies.length, 2)
            assert.strictEqual(res.body.body[2].replies.length, 2)
            assert.strictEqual(res.body.body[3].replies.length, 2)
            assert.strictEqual(res.body.body[4].replies.length, 2)
            assert.strictEqual(res.body.body[5].replies.length, 2)
        })

        it("should return threads of a certain category", async () => {
            const res = await request.get("/api/forums/?category=Discussion").expect(200)
            assert.strictEqual(res.body.body.length, 3)
        })

        it("should return threads according to a search query", async () => {
            const res = await request.get("/api/forums/?q=000001").expect(200)
            assert.strictEqual(res.body.body.length, 1)
            assert.strictEqual(res.body.body[0].title, "Thread 000001")
        })

        it("should return threads according to a search query and category", async () => {
            const res = await request.get("/api/forums/?q=000001&category=Discussion").expect(200)
            assert.strictEqual(res.body.body.length, 1)
            assert.strictEqual(res.body.body[0].title, "Thread 000001")
        })
    })

    describe("GET /api/forums/:threadId", () => {
        let threadId, users

        before(async () => {
            await prepareData()
            const thread = await ForumThread.findOne({ title: "Thread 000001" }).exec()
            threadId = thread._id
            users = await User.find({}).exec()
        })

        after(async () => {
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should return a thread by ID", async () => {
            const res = await request.get(`/api/forums/${threadId}`).expect(200)
            assert.strictEqual(res.body.body.title, "Thread 000001")
            assert.strictEqual(res.body.body.content, "Content for thread 1")
            assert.strictEqual(res.body.body.category, "Discussion")
            assert.strictEqual(res.body.body.createdUser._id, users[0]._id.toString())
            assert.strictEqual(res.body.body.createdUser.username, user1Data.username)
        })

        it("should return a 404 error if the thread does not exist", async () => {
            const res = await request.get("/api/forums/123456789012345678901234").expect(404)
        })
    })

    describe("POST /api/forums/", () => {
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
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should create a new thread", async () => {
            const res = await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "New Thread",
                    content: "This is a new thread",
                    category: "Discussion",
                })
                .expect(201)

            const createdThread = await ForumThread.findOne({ title: "New Thread" }).exec()
            assert.strictEqual(res.body.body.title, "New Thread")
            assert.strictEqual(res.body.body.content, "This is a new thread")
            assert.strictEqual(res.body.body.category, "Discussion")
            assert.strictEqual(res.body.body.createdUser, createdThread.createdUser.toString())
        })

        it("should return a 400 error if the title is missing", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "This is a new thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return a 400 error if the content is missing", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "New Thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return a 400 error if the category is missing", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "New Thread",
                    content: "This is a new thread",
                })
                .expect(400)
        })

        it("should return a 401 error if the user is not authenticated", async () => {
            await request
                .post("/api/forums/")
                .send({
                    title: "New Thread",
                    content: "This is a new thread",
                    category: "Discussion",
                })
                .expect(401)
        })

        it("should return 400 error if title is too short", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Short",
                    content: "This is a new thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if title is too long", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "This is a very long title that exceeds the maximum length",
                    content: "This is a new thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if content is too short", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "New Thread",
                    content: "Short",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if content is too long", async () => {
            await request
                .post("/api/forums/")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "New Thread",
                    content: "This is a very long content that exceeds the maximum length".repeat(
                        1000,
                    ),
                    category: "Discussion",
                })
                .expect(400)
        })
    })

    describe("PUT /api/forums/:threadId", () => {
        let threadId, userToken, otherUserToken

        before(async () => {
            await prepareData()
            const thread = await ForumThread.findOne({ title: "Thread 000001" }).exec()
            threadId = thread._id
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const otherLoginResponse = await request.post("/api/auth/login").send({
                email: "user2@example.com",
                password: "Testpassword@123",
            })
            otherUserToken = otherLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should update a thread", async () => {
            const res = await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(200)

            const updatedThread = await ForumThread.findOne({ _id: threadId }).exec()
            assert.strictEqual(updatedThread.title, "Updated Thread")
            assert.strictEqual(updatedThread.content, "This is an updated thread")
            assert.strictEqual(updatedThread.category, "Discussion")
        })

        it("should return a 404 error if the thread does not exist", async () => {
            await request
                .put("/api/forums/123456789012345678901234")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(404)
        })

        it("should return a 400 error if the title is missing", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return a 400 error if the content is missing", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return a 400 error if the category is missing", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    content: "This is an updated thread",
                })
                .expect(400)
        })

        it("should return a 401 error if the user is not authenticated", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .send({
                    title: "Updated Thread",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(401)
        })

        it("should return 400 error if title is too short", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Short",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if title is too long", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "This is a very long title that exceeds the maximum length",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if content is too short", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    content: "Short",
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return 400 error if content is too long", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    title: "Updated Thread",
                    content: "This is a very long content that exceeds the maximum length".repeat(
                        1000,
                    ),
                    category: "Discussion",
                })
                .expect(400)
        })

        it("should return a 403 error if the user is not the thread owner", async () => {
            await request
                .put(`/api/forums/${threadId}`)
                .set("Authorization", `Bearer ${otherUserToken}`)
                .send({
                    title: "Updated Thread",
                    content: "This is an updated thread",
                    category: "Discussion",
                })
                .expect(403)
        })
    })

    describe("DELETE /api/forums/:threadId", () => {
        let thread1Id, threa3Id, userToken, otherUserToken

        before(async () => {
            await prepareData()
            const thread1 = await ForumThread.findOne({ title: "Thread 000001" }).exec()
            const thread3 = await ForumThread.findOne({ title: "Thread 000003" }).exec()

            thread1Id = thread1._id
            thread3Id = thread3._id

            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const otherLoginResponse = await request.post("/api/auth/login").send({
                email: "user2@example.com",
                password: "Testpassword@123",
            })
            otherUserToken = otherLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should delete a thread", async () => {
            await request
                .delete(`/api/forums/${thread1Id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)

            const deletedThread = await ForumThread.findOne({ _id: thread1Id }).exec()
            assert.strictEqual(deletedThread, null)
        })

        it("should return a 404 error if the thread does not exist", async () => {
            await request
                .delete("/api/forums/123456789012345678901234")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(404)
        })

        it("should return a 401 error if the user is not authenticated", async () => {
            await request.delete(`/api/forums/${thread1Id}`).expect(401)
        })

        it("should return a 403 error if the user is not the thread owner", async () => {
            await request
                .delete(`/api/forums/${thread3Id}`)
                .set("Authorization", `Bearer ${otherUserToken}`)
                .expect(403)
        })
    })

    describe("POST /api/forums/:threadId/replies", () => {
        let threadId, userToken

        before(async () => {
            await prepareData()
            const thread = await ForumThread.findOne({ title: "Thread 000001" }).exec()
            threadId = thread._id
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await ForumThread.deleteMany({})
            await ForumThreadReply.deleteMany({})
        })

        it("should create a new reply", async () => {
            const res = await request
                .post(`/api/forums/${threadId}/replies`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "This is a new reply",
                })
                .expect(201)

            const releventThread = await ForumThread.findOne({ _id: threadId }).exec()
            const createdReply = await ForumThreadReply.findOne({
                content: "This is a new reply",
            }).exec()
            assert.strictEqual(res.body.body.content, "This is a new reply")
            assert.strictEqual(res.body.body.createdUser, createdReply.createdUser.toString())
            assert.strictEqual(releventThread.replies.includes(createdReply._id), true)
            assert.strictEqual(releventThread.replies.length, 3)
        })

        it("should return a 404 error if the thread does not exist", async () => {
            await request
                .post("/api/forums/123456789012345678901234/replies")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "This is a new reply",
                })
                .expect(404)
        })

        it("should return a 400 error if the content is missing", async () => {
            await request
                .post(`/api/forums/${threadId}/replies`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({})
                .expect(400)
        })

        it("should return a 401 error if the user is not authenticated", async () => {
            await request
                .post(`/api/forums/${threadId}/replies`)
                .send({
                    content: "This is a new reply",
                })
                .expect(401)
        })

        it("should return 400 error if content is too short", async () => {
            await request
                .post(`/api/forums/${threadId}/replies`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "Short",
                })
                .expect(400)
        })

        it("should return 400 error if content is too long", async () => {
            await request
                .post(`/api/forums/${threadId}/replies`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "This is a very long content that exceeds the maximum length".repeat(
                        1000,
                    ),
                })
                .expect(400)
        })

        it("should return 400 error if content is empty", async () => {
            await request
                .post(`/api/forums/${threadId}/replies`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    content: "",
                })
                .expect(400)
        })
    })
})
