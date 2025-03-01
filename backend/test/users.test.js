// some test cases are ai-generated using api specification

const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")

const User = require("../src/models/User")
const app = require("../src/app")
const request = supertest(app)

describe("Users", () => {
    before(async () => {
        await User.deleteMany({})
    })

    after(async () => {
        await User.deleteMany({})
    })

    describe("POST /api/users/", () => {
        it("should create a new user successfully", (done) => {
            const userData = {
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
                profileImage: "testimageurl",
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

        it("should return 400 for invalid email format", (done) => {
            const userData = {
                username: "testuser",
                password: "validpassword",
                email: "invalidemail",
                profileImage: "imageurl",
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
                profileImage: "imageurl",
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

        it("should return 409 if the email is already taken", (done) => {
            const userData = {
                username: "duplicateuser",
                password: "validpassword",
                email: "testuser@example.com", // This email is already taken from the setup
                profileImage: "imageurl",
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
                profileImage: "a".repeat(2 * 1024 * 1024 + 1), // 2MB + 1 byte
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
    })
})
