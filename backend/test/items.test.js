const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Item = require("../src/models/Item")
const User = require("../src/models/User")
const { populateItems } = require("../src/extras/populate")

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
    await Item.deleteMany({})

    const admin = await User.create(adminData)
    const user1 = await User.create(user1Data)
    await populateItems()
}

describe("Items", () => {
    before(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    after(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    describe("GET /api/items", () => {
        let user1Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return all items for the user", async () => {
            const res = await request.get("/api/items").expect(200)

            //assert.deepEqual(res.body.body, {})
            assert.strictEqual(res.body.body.length, 10)
            assert.strictEqual(res.body.body[0].itemName, "Item 10")
        })
    })

    describe("GET /api/items/:id", () => {
        let itemId

        before(async () => {
            await prepareData()
            itemId = (await Item.findOne({}))._id
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return item by id", async () => {
            const res = await request.get(`/api/items/${itemId}`).expect(200)

            assert.strictEqual(res.body.body.itemName, "Item 1")
        })

        it("should return 404 if item not found", async () => {
            await request.get("/api/items/123456789012345678901234").expect(404)
        })

        it("should return 400 if id is invalid", async () => {
            await request.get("/api/items/invalidId").expect(400)
        })
    })

    describe("POST /api/items", () => {
        let user1Token, adminToken

        const newItem = {
            itemName: "New Item",
            description: "New Item Description",
            price: 100,
            category: "Electronics",
            size: "S,M",
            colors: ["red", "blue"],
            quantity: 50,
            product: "data:image/jpeg;base64,placeholder",
        }

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should create a new item", async () => {
            await request
                .post("/api/items")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newItem)
                .expect(201)

            const createdItem = await Item.findOne({ itemName: newItem.itemName })

            assert.strictEqual(createdItem.itemName, newItem.itemName)
            assert.strictEqual(createdItem.description, newItem.description)
        })

        it("should return 403 if user is not admin", async () => {
            await request
                .post("/api/items")
                .set("Authorization", `Bearer ${user1Token}`)
                .send(newItem)
                .expect(403)
        })

        it("should return 400 if required fields are missing", async () => {
            const badItem = {
                itemName: "New Item",
                description: "New Item Description",
                price: 100,
                category: "Electronics",
            }

            await request
                .post("/api/items")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(badItem)
                .expect(400)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.post("/api/items").send(newItem).expect(401)
        })
    })

    describe("PUT /api/items/:id", () => {
        let itemId, user1Token, adminToken

        const updatedItem = {
            itemName: "Updated Item",
            description: "Updated Item Description",
            price: 150,
            category: "Electronics",
            size: "M,L",
            colors: ["green", "yellow"],
            quantity: 30,
            product: "data:image/jpeg;base64,placeholder",
        }

        before(async () => {
            await prepareData()
            itemId = (await Item.findOne({}))._id
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should update an item", async () => {
            await request
                .put(`/api/items/${itemId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedItem)
                .expect(200)

            const updated = await Item.findById(itemId)

            assert.strictEqual(updated.itemName, updatedItem.itemName)
            assert.strictEqual(updated.description, updatedItem.description)
        })

        it("should return 403 if user is not admin", async () => {
            await request
                .put(`/api/items/${itemId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send(updatedItem)
                .expect(403)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.put(`/api/items/${itemId}`).send(updatedItem).expect(401)
        })

        it("should return 404 if item not found", async () => {
            await request
                .put("/api/items/123456789012345678901234")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedItem)
                .expect(404)
        })

        it("should return 400 if id is invalid", async () => {
            await request
                .put("/api/items/invalidId")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updatedItem)
                .expect(400)
        })
    })

    describe("DELETE /api/items/:id", () => {
        let itemId, user1Token, adminToken

        before(async () => {
            await prepareData()
            itemId = (await Item.findOne({}))._id
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should delete an item", async () => {
            await request
                .delete(`/api/items/${itemId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)

            const deletedItem = await Item.findById(itemId)

            assert.strictEqual(deletedItem, null)
        })

        it("should return 403 if user is not admin", async () => {
            await request
                .delete(`/api/items/${itemId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.delete(`/api/items/${itemId}`).expect(401)
        })

        it("should return 404 if item not found", async () => {
            await request
                .delete("/api/items/123456789012345678901234")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404)
        })

        it("should return 400 if id is invalid", async () => {
            await request
                .delete("/api/items/invalidId")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
        })
    })

    describe("POST /api/items/:id/restock", () => {
        let itemId, user1Token, adminToken

        const restockData = {
            amount: 100,
        }

        before(async () => {
            await prepareData()
            itemId = (await Item.findOne({}))._id
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@example.com",
                password: "Testpassword@123",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "Adminpassword@123",
            })
            user1Token = user1LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should restock an item", async () => {
            await request
                .post(`/api/items/${itemId}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(restockData)
                .expect(200)

            const updatedItem = await Item.findById(itemId)

            assert.strictEqual(updatedItem.quantity, 100)
        })

        it("should return 403 if user is not admin", async () => {
            await request
                .post(`/api/items/${itemId}/restock`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send(restockData)
                .expect(403)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.post(`/api/items/${itemId}/restock`).send(restockData).expect(401)
        })

        it("should return 404 if item not found", async () => {
            await request
                .post("/api/items/123456789012345678901234/restock")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(restockData)
                .expect(404)
        })

        it("should return 400 if id is invalid", async () => {
            await request
                .post("/api/items/invalidId/restock")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(restockData)
                .expect(400)
        })

        it("should return 400 if quantity is not provided", async () => {
            await request
                .post(`/api/items/${itemId}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({})
                .expect(400)
        })

        it("should return 400 if quantity is not a number", async () => {
            await request
                .post(`/api/items/${itemId}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ quantity: "invalid" })
                .expect(400)
        })

        it("should return 400 if quantity is less than 0", async () => {
            await request
                .post(`/api/items/${itemId}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ quantity: -10 })
                .expect(400)
        })
    })
})
