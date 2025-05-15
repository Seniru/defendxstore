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

describe("Deliveries", () => {
    before(async () => {
        await prepareData()
    })

    after(async () => {
        await Order.deleteMany({})
        await User.deleteMany({})
        await Item.deleteMany({})
    })

    describe("GET /api/deliveries/my", () => {
        let user1Token
        let agentToken
        let agentId

        before(async () => {
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

            // assign three deliveries to the agent
            const agent = await User.findOne({ email: "agent1@defendxstore.com" }).exec()
            const orders = await Order.find({ assignedAgent: null }).limit(3).select("_id").exec()
            agentId = agent._id

            await Order.updateMany(
                { _id: { $in: orders.map((o) => o._id) } },
                { assignedAgent: agent._id },
            )
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return all deliveries for the agent", async () => {
            const res = await request
                .get("/api/deliveries/my")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.ok(res.body.body.length >= 3)
            for (let order of res.body.body) {
                assert.strictEqual(order.assignedAgent._id.toString(), agentId.toString())
                assert.strictEqual(order.assignedAgent.username, "deliveryAgent1")
                assert.strictEqual(order.assignedAgent.email, "agent1@defendxstore.com")
            }
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/deliveries/my").expect(401)
        })

        it("should return an error if the user is not a delivery agent", async () => {
            await request
                .get("/api/deliveries/my")
                .set("Authorization", `Bearer ${user1Token}`)
                .expect(403)
        })

        it("should return all pending deliveries for the agent", async () => {
            const res = await request
                .get("/api/deliveries/my?status=pending")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 0)
        })

        it("should return all on_the_way deliveries for the agent", async () => {
            const res = await request
                .get("/api/deliveries/my?status=on_the_way")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.strictEqual(res.body.body.length, 0)
        })

        it("should return all delivered deliveries for the agent", async () => {
            const res = await request
                .get("/api/deliveries/my?status=delivered")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.ok(res.body.body.length >= 3)
        })

        it("should return an error if the status is invalid", async () => {
            await request
                .get("/api/deliveries/my?status=invalid")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(400)
        })
    })

    describe("GET /api/deliveries/unassigned", () => {
        let agentToken, userToken

        before(async () => {
            await prepareData()
            const agentLoginResponse = await request.post("/api/auth/login").send({
                email: "agent1@defendxstore.com",
                password: "pass",
            })
            const userLoginResponse = await request.post("/api/auth/login").send({
                email: "user1@defendxstore.com",
                password: "pass",
            })
            agentToken = agentLoginResponse.body.body.token
            userToken = userLoginResponse.body.body.token

            const item = await Item.findOne({}).exec()
            const user = await User.findOne({}).exec()

            await Order.create({
                items: [
                    {
                        product: item._id,
                        quantity: 2,
                        color: "red",
                        size: "M",
                    },
                ],
                user: user._id,
                assignedAgent: null,
                status: "pending",
                deliveryAddress: "123 Main St",
                orderdate: new Date(),
                price: 100,
            })
        })

        after(async () => {
            await Order.deleteMany({})
            await User.deleteMany({})
            await Item.deleteMany({})
        })

        it("should return all unassigned deliveries", async () => {
            const res = await request
                .get("/api/deliveries/unassigned")
                .set("Authorization", `Bearer ${agentToken}`)
                .expect(200)

            assert.equal(res.body.body.length, 1)
            assert.equal(res.body.body[0].assignedAgent, null)
            assert.equal(res.body.body[0].status, "pending")
            assert.equal(res.body.body[0].items.length, 1)
            assert.equal(res.body.body[0].deliveryAddress, "123 Main St")
            assert.equal(res.body.body[0].price, 100)
        })

        it("should return an error if the user is not logged in", async () => {
            await request.get("/api/deliveries/unassigned").expect(401)
        })

        it("should return an error if the user is not a delivery agent", async () => {
            await request
                .get("/api/deliveries/unassigned")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)
        })
    })
})
