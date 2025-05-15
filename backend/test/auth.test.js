require("dotenv").config()

const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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

    describe("POST /api/auth/verify", () => {
        let userToken, verifieduserToken

        before(async () => {
            await User.deleteMany()
            // Create a test user in the database
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash("testpassword", salt)
            testUser = await User.create({
                username: "testuser",
                password: hashedPassword,
                email: "user@example.com",
                role: 1,
            })

            await User.create({
                username: "verifieduser",
                password: hashedPassword,
                email: "verified@example.com",
                role: 1,
                verified: true,
            })

            const userLoginResponse = await request
                .post("/api/auth/login")
                .send({ email: "user@example.com", password: "testpassword" })

            const verifiedUserLoginResponse = await request
                .post("/api/auth/login")
                .send({ email: "verified@example.com", password: "testpassword" })
            userToken = userLoginResponse.body.body.token
            verifieduserToken = verifiedUserLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany()
        })

        it("should initiate the verification process", async () => {
            const response = await request
                .post("/api/auth/verify")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)

            assert.strictEqual(response.body.body, "Email sent")
        })

        it("should return 403 if email is already verified", async () => {
            await request
                .post("/api/auth/verify")
                .set("Authorization", `Bearer ${verifieduserToken}`)
                .expect(400)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.post("/api/auth/verify").expect(401)
        })
    })

    describe("PUT /api/auth/verify", () => {
        let userToken, verifieduserToken

        before(async () => {
            await User.deleteMany()
            // Create a test user in the database
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash("testpassword", salt)
            testUser = await User.create({
                username: "testuser",
                password: hashedPassword,
                email: "user@example.com",
                role: 1,
            })
            await User.create({
                username: "verifieduser",
                password: hashedPassword,
                email: "verified@example.com",
                role: 1,
            })
            const userLoginResponse = await request
                .post("/api/auth/login")
                .send({ email: "user@example.com", password: "testpassword" })
            const verifiedUserLoginResponse = await request
                .post("/api/auth/login")
                .send({ email: "verified@example.com", password: "testpassword" })
            userToken = userLoginResponse.body.body.token
            verifieduserToken = verifiedUserLoginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany()
        })

        it("should verify the user with a valid token", async () => {
            const verificationToken = jwt.sign(
                { email: "user@example.com", action: "EMAIL_VERIFICATION" },
                process.env.JWT_SECRET,
                {
                    algorithm: "HS256",
                    expiresIn: "1h",
                },
            )

            await request
                .put("/api/auth/verify?token=" + verificationToken)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200)
        })

        it("should return 200 if user is already verified", async () => {
            const verificationToken = jwt.sign(
                { email: "verified@example.com", action: "EMAIL_VERIFICATION" },
                process.env.JWT_SECRET,
                {
                    algorithm: "HS256",
                    expiresIn: "1h",
                },
            )
            await request
                .put("/api/auth/verify?token=" + verificationToken)
                .set("Authorization", `Bearer ${verifieduserToken}`)
                .expect(200)
        })

        it("should return 401 if user is not logged in", async () => {
            await request.put("/api/auth/verify").expect(401)
        })

        it("should return 400 if token is invalid", async () => {
            await request
                .put("/api/auth/verify?token=invalidtoken")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(400)
        })

        it("should return 400 if token is not present", async () => {
            await request
                .put("/api/auth/verify")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(400)
        })

        it("should return forbidden if token doesn't match the user", async () => {
            const verificationToken = jwt.sign(
                { email: "user@example.com", action: "EMAIL_VERIFICATION" },
                process.env.JWT_SECRET,
                {
                    algorithm: "HS256",
                    expiresIn: "1h",
                },
            )

            await request
                .put("/api/auth/verify?token=" + verificationToken)
                .set("Authorization", `Bearer ${verifieduserToken}`)
                .expect(403)
        })
    })
})
