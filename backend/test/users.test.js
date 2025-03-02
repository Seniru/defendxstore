// some test cases are ai-generated using api specification

const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const User = require("../src/models/User")
const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

describe("Users", () => {
    before(async () => {
        await User.deleteMany({})
    })

    after(async () => {
        await User.deleteMany({})
    })

    describe("GET /api/users", () => {
        let userToken, adminToken
        const salt = bcrypt.genSaltSync(10)

        before(async () => {
            await User.deleteMany({})
            // create admin user
            await User.create({
                username: "admin",
                password: bcrypt.hashSync("adminpassword", salt),
                email: "admin@example.com",
                role: 1 << 3,
            })
            // create 1 user with profile image
            await User.create({
                username: "userwithimage",
                password: bcrypt.hashSync("testpassword", salt),
                email: "imageuser@example.com",
                role: 1 << 0,
                profileImage: "data:image/png;base64,abc",
            })
            // create 1 user with contactNumber and deliveryAddress
            await User.create({
                username: "userwithcontact",
                password: bcrypt.hashSync("testpassword", salt),
                email: "contactuser@example.com",
                role: 1 << 0,
                deliveryAddress: "Test Address",
                contactNumber: ["123456789"],
            })
            // create 5 users
            for (let i = 0; i < 5; i++) {
                await User.create({
                    username: `user${i}`,
                    password: bcrypt.hashSync("testpassword", salt),
                    email: `user${i}@example.com`,
                    role: 1 << 0,
                })
            }
            // create 5 delivery agents
            for (let i = 0; i < 5; i++) {
                await User.create({
                    username: `delivery${i}`,
                    password: bcrypt.hashSync("testpassword", salt),
                    email: `delivery${i}@example.com`,
                    role: 1 << 1,
                })
            }
            // create 5 support agents
            for (let i = 0; i < 5; i++) {
                await User.create({
                    username: `support${i}`,
                    password: bcrypt.hashSync("testpassword", salt),
                    email: `support${i}@example.com`,
                    role: 1 << 2,
                })
            }

            // log in as a user
            const loginResponse = await request.post("/api/auth/login").send({
                email: "user3@example.com",
                password: "testpassword",
            })
            // log in as administrator to view details
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "adminpassword",
            })
            adminToken = adminLoginResponse.body.body.token
            userToken = loginResponse.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should return 403 forbidden for non-admin users", (done) => {
            request
                .get("/api/users")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403)
                .then((res) => {
                    assert.deepEqual(res.body.body, "Forbidden")
                    done()
                })
                .catch(done)
        })

        it("should return all users for admin users", (done) => {
            request
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 18)
                    done()
                })
                .catch(done)
        })

        it("should return all users when type is specified as user", (done) => {
            request
                .get("/api/users?type=USER")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 7)
                    done()
                })
                .catch(done)
        })

        it("should return all users when type is specified as delivery_agent", (done) => {
            request
                .get("/api/users?type=DELIVERY_AGENT")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 5)
                    done()
                })
                .catch(done)
        })

        it("should return all users when type is specified as support_agent", (done) => {
            request
                .get("/api/users?type=SUPPORT_AGENT")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 5)
                    done()
                })
                .catch(done)
        })

        it("should return all users when type is specified as admin", (done) => {
            request
                .get("/api/users?type=ADMIN")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 1)
                    done()
                })
                .catch(done)
        })

        it("should return 400 for invalid type", (done) => {
            request
                .get("/api/users?type=INVALID")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, "Invalid type")
                    done()
                })
                .catch(done)
        })

        it("should return all users when search is specified", (done) => {
            request
                .get("/api/users?search=with")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 2)
                    done()
                })
                .catch(done)
        })

        it("should return all users when search is specified with type", (done) => {
            request
                .get("/api/users?search=1&type=USER")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.equal(res.body.body.users.length, 1)
                    done()
                })
                .catch(done)
        })

        it("should include profile image url for users with profile image", (done) => {
            request
                .get("/api/users?search=userwithimage")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.ok(
                        res.body.body.users[0].profileImage.includes(
                            "api/users/userwithimage/profileImage",
                        ),
                    )
                    done()
                })
                .catch(done)
        })

        it("should not have profileImage field for users without profile image", (done) => {
            request
                .get("/api/users?search=userwithcontact")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.ok(!res.body.body.users[0].profileImage)
                    done()
                })
                .catch(done)
        })

        it("should display contact details for users with contact details", (done) => {
            request
                .get("/api/users?search=userwithcontact")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.body.users[0].contactNumber, ["123456789"])
                    assert.deepEqual(res.body.body.users[0].deliveryAddress, "Test Address")
                    done()
                })
                .catch(done)
        })
    })

    describe("POST /api/users/", () => {
        before(async () => {
            await User.deleteMany({})
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should create a new user successfully", (done) => {
            const userData = {
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
                profileImage: "data:image/png;base64,abc",
                deliveryAddress: "Test Address",
                contactNumber: ["123456789"],
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(201)
                .then((res) => {
                    assert.ok(res.body.body.token)
                    done()
                })
                .catch(done)
        })

        it("should return 400 for no password", (done) => {
            const userData = {
                username: "testuser",
                email: "testuser@example.com",
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "password", message: "You must provide a password" },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should return 400 for invalid email format", (done) => {
            const userData = {
                username: "testuser",
                password: "validpassword",
                email: "invalidemail",
                profileImage: "data:image/png;base64,abc",
                deliveryAddress: "Some address",
                contactNumbers: ["123456789"],
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "email", message: "Please enter a valid email address" },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should return 400 for missing required fields", (done) => {
            const userData = {
                username: "userwithoutemail",
                password: "validpassword",
                // Missing email field
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "email", message: "Path `email` is required." },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should create a user without optional fields", (done) => {
            const userData = {
                username: "testuser2",
                password: "validpassword",
                email: "testuser3@example.com",
                // Optional fields are omitted (e.g., deliveryAddress, contactNumbers)
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(201)
                .then((res) => {
                    assert.ok(res.body.body.token)
                    done()
                })
                .catch(done)
        })

        it("should return 409 if the username is already taken", (done) => {
            const userData = {
                username: "testuser",
                password: "validpassword",
                email: "valid@example.com",
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(409)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "username", message: "Username taken" },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should return 409 if the email is already taken", (done) => {
            const userData = {
                username: "duplicateuser",
                password: "validpassword",
                email: "testuser@example.com", // This email is already taken from the setup
                profileImage: "data:image/png;base64,abc",
                deliveryAddress: "Some address",
                contactNumbers: ["123456789"],
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(409)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "email", message: "User already exist with this email" },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should return 400 if image size is greater than 2MB", (done) => {
            const userData = {
                username: "testuser",
                password: "testpassword",
                email: "testuser4@gmail.com",
                profileImage: "data:image/png;base64,abc" + "a".repeat(2 * 1024 * 1024 + 1), // 2MB + 1 byte
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        {
                            field: "profileImage",
                            message: "Image should be less than 2 MB in size",
                        },
                    ])
                    done()
                })
                .catch(done)
        })

        it("should return 400 if image format is invalid", (done) => {
            const userData = {
                username: "invalidimageuser",
                password: "testpassword",
                email: "invalidimageuser@example.com",
                profileImage: "invalidimage",
            }

            request
                .post("/api/users/")
                .send(userData)
                .expect(400)
                .then((res) => {
                    assert.deepEqual(res.body.body, [
                        { field: "profileImage", message: "Invalid profile image format" },
                    ])
                    done()
                })
                .catch(done)
        })
    })

    describe("GET /api/users/:username/profileImage", () => {
        before(async () => {
            await User.deleteMany({})
            await User.insertMany([
                {
                    username: "testuser",
                    password: "testpassword",
                    email: "testuser@example.com",
                    profileImage: "data:image/png;base64,abc",
                },
                {
                    username: "testuser2",
                    password: "testpassword",
                    email: "testuser2@example.com",
                },
            ])
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should return the profile image of the user", (done) => {
            request
                .get("/api/users/testuser/profileImage")
                .expect(200)
                .then((res) => {
                    assert.ok(res.body)
                    done()
                })
                .catch(done)
        })
        it("should return 404 if the user does not exist", (done) => {
            request
                .get("/api/users/nonexistentuser/profileImage")
                .expect(404)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User not found")
                    done()
                })
                .catch(done)
        })
        it("should return 404 if the user does not have a profile image", (done) => {
            request
                .get("/api/users/testuser2/profileImage")
                .expect(404)
                .then((res) => {
                    assert.deepEqual(res.body.body, "No profile image found")
                    done()
                })
                .catch(done)
        })
    })
})
