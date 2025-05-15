const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const User = require("../src/models/User")
const Item = require("../src/models/Item")
const { populateItems } = require("../src/extras/populate")
const request = supertest(app)

const salt = bcrypt.genSaltSync(10)

const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: bcrypt.hashSync("Password@123", salt),
    notifications: [{ message: "Notification 1" }, { message: "Notification 2" }],
    cart: [],
    role: 1 << 0,
}

const user2Data = {
    username: "testuser2",
    email: "testuser2@example.com",
    password: bcrypt.hashSync("Password@123", salt),
    role: 1 << 0,
}

const prepareData = async () => {
    await User.deleteMany({})
    await Item.deleteMany({})
    await populateItems()

    const items = await Item.find({})
    const itemIds = items.map((item) => item._id)
    let colors = ["red", "blue", "green"]
    let sizes = ["S", "M", "L"]

    userData.cart = itemIds.map((itemId, index) => ({
        product: itemId,
        color: colors[index % colors.length],
        size: sizes[index % sizes.length],
    }))
    const user1 = await User.create(userData)
    const user2 = await User.create(user2Data)
}

describe("Cart", () => {
    let testUser = null

    before(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
        await prepareData()
    })

    after(async () => {
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    describe("GET /api/cart", () => {
        let user1Token, user2Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser2@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return all items in the cart for the user", async () => {
            const res = await request
                .get(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.strictEqual(res.body.body.totalItems, 10)
            assert.strictEqual(res.body.body.cart[0].itemName, "Item 1")
            assert.strictEqual(res.body.body.cart[0].color, "red")
            assert.strictEqual(res.body.body.cart[0].size, "S")
            assert.strictEqual(res.body.body.cart[0].quantity, 1)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/users/testuser/cart").expect(401)
        })

        it("should return 403 if the user tries to access another user's cart", async () => {
            await request
                .get(`/api/users/testuser2/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })
    })

    describe("POST /api/cart", () => {
        let user1Token, user2Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser2@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should add an item to the cart", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            const res = await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: itemId,
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(200)

            const user = await User.findOne({ username: "testuser" })
            assert.strictEqual(user.cart.length, 11)
            assert.strictEqual(user.cart[10].product.toString(), itemId.toString())
            assert.strictEqual(user.cart[10].size, "M")
            assert.strictEqual(user.cart[10].color, "blue")
        })

        it("should return an error if the user is not logged in", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            await request
                .post(`/api/users/testuser/cart`)
                .send({
                    productId: itemId,
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(401)
        })

        it("should return 403 if the user tries to add an item to another user's cart", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            await request
                .post(`/api/users/testuser2/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: itemId,
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(403)
        })

        it("should return 400 if the productId is invalid", async () => {
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: "invalidId",
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(400)
        })

        it("should return 400 if the productId is not provided", async () => {
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(400)
        })

        it("should return 400 if the size is not provided", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: itemId,
                    color: "blue",
                    quantity: 1,
                })
                .expect(400)
        })

        it("should return 400 if the color is not provided", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: itemId,
                    size: "M",
                    quantity: 1,
                })
                .expect(400)
        })

        it("should return 404 if the item is not found", async () => {
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: new mongoose.Types.ObjectId(),
                    size: "M",
                    color: "blue",
                    quantity: 1,
                })
                .expect(404)
        })

        it("should return 400 if quantity is not provided", async () => {
            const items = await Item.find({})
            const itemId = items[0]._id
            await request
                .post(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({
                    productId: itemId,
                    size: "M",
                    color: "blue",
                })
                .expect(400)
        })
    })

    describe("DELETE /api/cart", () => {
        let user1Token, user2Token

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "testuser@example.com",
                password: "Password@123",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should empty the cart for the user", async () => {
            const res = await request
                .delete(`/api/users/testuser/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            const user = await User.findOne({ username: "testuser" })
            assert.strictEqual(user.cart.length, 0)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.delete("/api/users/testuser/cart").expect(401)
        })

        it("should return 403 if the user tries to empty another user's cart", async () => {
            await request
                .delete(`/api/users/testuser2/cart`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })
    })
})
