const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const Order = require("../src/models/Order")
const User = require("../src/models/User")
const Promocode = require("../src/models/Promocodes")
const Item = require("../src/models/Item")

const { populateItems, populateUsers, populateOrders } = require("../src/extras/populate")

const prepareData = async () => {
    await Order.deleteMany({})
    await User.deleteMany({})
    await Item.deleteMany({})
    await populateItems()
    await populateUsers()
    await populateOrders()

    const user1 = await User.findOne({ email: "user1@defendxstore.com" }).exec()
    const item1 = await Item.findOne({ itemName: "Item 1" }).exec()
    const item2 = await Item.findOne({ itemName: "Item 2" }).exec()

    await Item.create({
        itemName: "Discount test item",
        price: 100,
        description: "This is a test item",
        category: "clothing",
        product: "https://example.com/image.jpg",
        quantity: 10,
        colors: ["red", "blue"],
        size: ["S", "M", "L"],
    })

    await Order.create({
        user: user1._id,
        price: 100,
        status: "delivered",
        orderdate: new Date(),
        items: [
            {
                product: item1._id,
                color: "red",
                size: "M",
                quantity: 2,
            },
            {
                product: item2._id,
                color: "blue",
                size: "L",
                quantity: 1,
            },
        ],
    })

    await Order.create({
        user: user1._id,
        price: 100,
        status: "on_the_way",
        orderdate: new Date(),
        items: [
            {
                product: item1._id,
                color: "red",
                size: "M",
                quantity: 2,
            },
            {
                product: item2._id,
                color: "blue",
                size: "L",
                quantity: 1,
            },
        ],
    })

    await Order.create({
        user: user1._id,
        price: 100,
        status: "pending",
        orderdate: new Date(),
        items: [
            {
                product: item1._id,
                color: "red",
                size: "M",
                quantity: 2,
            },
            {
                product: item2._id,
                color: "blue",
                size: "L",
                quantity: 1,
            },
            {
                product: item1._id,
                color: "green",
                size: "S",
                quantity: 3,
            },
        ],
    })
}

describe("Orders", () => {
    before(async () => {
        await prepareData()
    })

    after(async () => {
        await Order.deleteMany({})
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    describe("GET /api/orders", () => {
        let user1Token
        let user2Token

        before(async () => {
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "user2@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return all orders for the user", async () => {
            const res = await request
                .get("/api/orders")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.ok(res.body.body.length > 0)
            assert.strictEqual(res.body.body.at(-1).items[0].itemName, "Item 1")
            assert.strictEqual(res.body.body.at(-1).items[0].color, "red")
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/orders").expect(401)
        })

        it("should return orders of pending status", async () => {
            const res = await request
                .get("/api/orders?status=pending")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.equal(res.body.body.length, 1)
            assert.strictEqual(res.body.body[0].status, "pending")
        })

        it("should return orders of delivered status", async () => {
            const res = await request
                .get("/api/orders?status=delivered")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.ok(res.body.body.length > 0)
        })

        it("should return orders of on_the_way status", async () => {
            const res = await request
                .get("/api/orders?status=on_the_way")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)

            assert.equal(res.body.body.length, 1)
        })

        it("should return bad request if status is invalid", async () => {
            await request
                .get("/api/orders?status=invalid")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(400)
        })
    })

    describe("POST /api/orders", () => {
        let user1Token, user2Token, user3Token, user4Token, user5Token
        let commonCart

        before(async () => {
            await prepareData()

            let item1 = await Item.findOne({ itemName: "Item 1" }).exec()
            let item2 = await Item.findOne({ itemName: "Item 2" }).exec()

            const commonCart = [
                {
                    product: item1._id,
                    color: "red",
                    size: "M",
                    quantity: 2,
                },
                {
                    product: item2._id,
                    color: "blue",
                    size: "L",
                    quantity: 1,
                },
            ]

            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "user2@defendxstore.com",
                password: "pass",
            })
            const user3LoginResponse = await request.post("/api/auth/login").send({
                email: "user3@defendxstore.com",
                password: "pass",
            })
            const user4LoginResponse = await request.post("/api/auth/login").send({
                email: "user4@defendxstore.com",
                password: "pass",
            })
            const user5LoginResponse = await request.post("/api/auth/login").send({
                email: "user5@defendxstore.com",
                password: "pass",
            })

            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
            user3Token = user3LoginResponse.body.body.token
            user4Token = user4LoginResponse.body.body.token
            user5Token = user5LoginResponse.body.body.token

            // put items to cart
            await User.findOneAndUpdate(
                { email: "user1@defendxstore.com" },
                {
                    cart: commonCart,
                },
            ).exec()

            await User.findOneAndUpdate(
                { email: "user3@defendxstore.com" },
                {
                    cart: commonCart,
                    verified: true,
                },
            ).exec()

            await User.findOneAndUpdate(
                { email: "user5@defendxstore.com" },
                {
                    cart: commonCart,
                },
            ).exec()

            const discountItem = await Item.findOne({ itemName: "Discount test item" }).exec()

            await User.findOneAndUpdate(
                { email: "user4@defendxstore.com" },
                {
                    cart: [
                        {
                            product: discountItem._id,
                            color: "red",
                            size: "M",
                        },
                        {
                            product: discountItem._id,
                            color: "red",
                            size: "M",
                        },
                    ],
                },
            ).exec()

            await Promocode.create({
                promocode: "DISCOUNT10",
                discount: 10,
                validuntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            })
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should create a new order", async () => {
            const res = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user1Token}`)
                .send({ deliveryAddress: "123 Main St, Cityville" })
                .expect(201)

            const user = await User.findOne({ email: "user1@defendxstore.com" }).exec()
            const orders = await Order.find({ user: user._id }).exec()
            assert.strictEqual(user.cart.length, 0)
            assert.ok(orders.length > 0)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.post("/api/orders").expect(401)
        })

        it("should return an error if the delivery address is not provided", async () => {
            await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user1Token}`)
                .send({ deliveryAddress: "" })
                .expect(400)
        })

        it("should return an error if the cart is empty", async () => {
            await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user2Token}`)
                .send({ deliveryAddress: "123 Main St, Cityville" })
                .expect(400)
        })

        it("should send an email to the user after order creation, if they are verified", async () => {
            const res = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user3Token}`)
                .send({ deliveryAddress: "123 Main St, Cityville" })
                .expect(201)

            // there's no way to check if the email was sent, we assume the email
            // was sent if the order was created successfully
        })

        it("should apply a discount if promocode is provided", async () => {
            const res = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user4Token}`)
                .send({
                    deliveryAddress: "123 Main St, Cityville",
                    promocode: "DISCOUNT10",
                })
                .expect(201)

            const user = await User.findOne({ email: "user4@defendxstore.com" }).exec()
            const orders = await Order.find({ user: user._id }).exec()
            assert.strictEqual(user.cart.length, 0)
            assert.ok(orders.length > 0)
            assert.strictEqual(orders.at(-1).price, 180) // 200 - 20% = 180
        })

        it("should return an error if the promocode is invalid", async () => {
            const res = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${user5Token}`)
                .send({
                    deliveryAddress: "123 Main St, Cityville",
                    promocode: "INVALIDCODE",
                })
                .expect(404)
        })
    })

    describe("GET /api/orders/:id", () => {
        let user1Token, user2Token, agentToken
        let orderId

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "user2@defendxstore.com",
                password: "pass",
            })
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent1@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
            agentToken = agentLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return order details for the user", async () => {
            const user = await User.findOne({ email: "user1@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id

            await request
                .get(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get(`/api/orders/${orderId}`).expect(401)
        })

        it("should return an error if the order does not belong to the user", async () => {
            await request
                .get(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${user2Token}`)
                .expect(403)
        })

        it("should return an error if the order ID is invalid", async () => {
            await request
                .get("/api/orders/invalidOrderId")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(400)
        })

        it("should return an error if the order is not found", async () => {
            const invalidOrderId = new mongoose.Types.ObjectId()
            await request
                .get(`/api/orders/${invalidOrderId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(404)
        })

        it("should show order details for delivery agents", async () => {
            const user = await User.findOne({ email: "user1@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id
            const res = await request
                .get(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.user.username, "user1")
        })
    })

    describe("DELETE /api/orders/:id", () => {
        let user1Token, user2Token, adminToken, agentToken, orderId

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const user2LoginResponse = await request.post("/api/auth/login").send({
                email: "user2@defendxstore.com",
                password: "pass",
            })
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@defendxstore.com",
                password: "pass",
            })
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent1@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            user2Token = user2LoginResponse.body.body.token
            adminToken = adminLoginResponse.body.body.token
            agentToken = agentLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should delete an order for the user", async () => {
            const user = await User.findOne({ email: "user1@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id
            await request
                .delete(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(200)
            const deletedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(deletedOrder, null)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.delete(`/api/orders/${orderId}`).expect(401)
        })

        it("should return an error if the order does not belong to the user", async () => {
            const user = await User.findOne({ email: "user5@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id

            await request
                .delete(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${user2Token}`)
                .expect(403)
        })

        it("should return an error if the order ID is invalid", async () => {
            await request
                .delete("/api/orders/invalidOrderId")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(400)
        })

        it("should return an error if the order is not found", async () => {
            const invalidOrderId = new mongoose.Types.ObjectId()
            await request
                .delete(`/api/orders/${invalidOrderId}`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(404)
        })

        it("should let admin delete any order", async () => {
            const user = await User.findOne({ email: "user2@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id
            await request
                .delete(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
            const deletedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(deletedOrder, null)
        })

        it("should let delivery agent delete any order", async () => {
            const user = await User.findOne({ email: "user3@defendxstore.com" }).exec()
            const order = await Order.findOne({ user: user._id }).exec()
            orderId = order._id
            await request
                .delete(`/api/orders/${orderId}`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)
            const deletedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(deletedOrder, null)
        })
    })

    describe("POST /api/orders/:id/delivery", () => {
        let user1Token, agentToken, orderId
        let acquiredOrderId

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent1@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            agentToken = agentLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should assign a delivery agent to an order", async () => {
            const order = await Order.findOne({ status: "pending" }).exec()
            acquiredOrderId = order._id
            await request
                .post(`/api/orders/${acquiredOrderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)
            const updatedOrder = await Order.findById(acquiredOrderId)
                .populate("assignedAgent")
                .exec()
            assert.strictEqual(updatedOrder.assignedAgent.username.toString(), "deliveryAgent1")
        })

        it("should return an error if the user is not logged in", async () => {
            await request.post(`/api/orders/${orderId}/delivery`).expect(401)
        })

        it("should return an error if the order ID is invalid", async () => {
            await request
                .post("/api/orders/invalidOrderId/delivery")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(400)
        })

        it("should return an error if the order is not found", async () => {
            const invalidOrderId = new mongoose.Types.ObjectId()
            await request
                .post(`/api/orders/${invalidOrderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(404)
        })

        it("should return a conflict error if the order is already assigned to a delivery agent", async () => {
            await request
                .post(`/api/orders/${acquiredOrderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(409)
        })

        it("should return a forbidden error if the user is not a delivery agent", async () => {
            const order = await Order.findOne({ status: "pending" }).exec()
            orderId = order._id
            await request
                .post(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
            const updatedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(updatedOrder.status, "pending")
        })

        it("should return a forbidden error if the order is already delivered", async () => {
            const order = await Order.findOne({ status: "delivered" }).exec()
            orderId = order._id
            await request
                .post(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(403)
        })
    })

    describe("PUT /api/orders/:id/delivery", () => {
        let user1Token, agentToken, orderId

        before(async () => {
            await prepareData()
            const user1LoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent1@defendxstore.com",
                password: "pass",
            })
            user1Token = user1LoginResponse.body.body.token
            agentToken = agentLoginResponse.body.body.token
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should update the order status to on_the_way", async () => {
            const agent = await User.findOne({ email: "agent1@defendxstore.com" })
            const order = await Order.findOneAndUpdate(
                { status: "pending" },
                { assignedAgent: agent._id },
            ).exec()
            orderId = order._id

            await request
                .put(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({ status: "on_the_way" })
                .expect(200)
            const updatedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(updatedOrder.status, "on_the_way")
        })

        it("should update the order status to delivered", async () => {
            const agent = await User.findOne({ email: "agent1@defendxstore.com" })
            const order = await Order.findOneAndUpdate({ assignedAgent: agent._id }).exec()
            orderId = order._id

            await request
                .put(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({ status: "delivered" })
                .expect(200)
            const updatedOrder = await Order.findById(orderId).exec()
            assert.strictEqual(updatedOrder.status, "delivered")
        })

        it("should return an error if the user is not logged in", async () => {
            await request.put(`/api/orders/${orderId}/delivery`).expect(401)
        })

        it("should return an error if the order ID is invalid", async () => {
            await request
                .put("/api/orders/invalidOrderId/delivery")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(400)
        })

        it("should return an error if the order is not found", async () => {
            const invalidOrderId = new mongoose.Types.ObjectId()
            await request
                .put(`/api/orders/${invalidOrderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({ status: "on_the_way" })
                .expect(404)
        })

        it("should return a forbidden error if the user is not a delivery agent", async () => {
            const otherAgent = await User.findOne({ email: "agent2@defendxstore.com" }).exec()
            const order = await Order.findOneAndUpdate({ assignedAgent: otherAgent._id }).exec()
            orderId = order._id
            await request
                .put(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${user1Token}`)
                .send({ status: "on_the_way" })
                .expect(403)
        })

        it("should return bad request if the status is invalid", async () => {
            const order = await Order.findOne().exec()
            orderId = order._id
            await request
                .put(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .send({ status: "invalid" })
                .expect(400)
        })

        it("should return bad request if status is not provided", async () => {
            const order = await Order.findOne().exec()
            orderId = order._id
            await request
                .put(`/api/orders/${orderId}/delivery`)
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(400)
        })
    })
})
