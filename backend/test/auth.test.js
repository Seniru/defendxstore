const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const User = require("../src/models/User")
const app = require("../src/app")
const request = supertest(app)

describe("Auth", () => {
    let testUser = null

    before(async () => {
        console.log = () => {}
        // Create a test user in the database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("testpassword", salt)
        testUser = new User({
            username: "testuser",
            password: hashedPassword,
            email: "testuser@example.com",
            profileImage: "testimageurl",
            deliveryAddress: "Test Address",
            contactNumber: ["123456789"],
            roles: ["customer"],
        })
        await testUser.save()
    })

    after(async () => {
        await User.findByIdAndDelete(testUser._id)
    })

    describe("POST /api/auth/login", () => {
        it("should log in successfully with valid credentials", (done) => {
            request
                .post("/api/auth/login")
                .send({ email: "testuser@example.com", password: "testpassword" })
                .expect(200)
                .then((res) => {
                    assert.ok(res.body.body.token)
                    done()
                })
                .catch(done)
        })

        it("should return 401 for invalid password", (done) => {
            request
                .post("/api/auth/login")
                .send({ email: "testuser@example.com", password: "wrongpassword" })
                .expect(401, done)
        })

        it("should return 404 if user not found", (done) => {
            request
                .post("/api/auth/login")
                .send({ email: "nonexistent@example.com", password: "testpassword" })
                .expect(404, done)
        })
    })
})
