// some test cases are ai-generated using api specification

const assert = require("assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const User = require("../src/models/User")
const app = require("../src/app")
const logger = require("../src/utils/logger")
const request = supertest(app)

const salt = bcrypt.genSaltSync(10)

const adminData = {
    username: "admin",
    password: bcrypt.hashSync("adminpassword", salt),
    email: "admin@example.com",
    role: 1 << 3,
}

const profileImageUserData = {
    username: "userwithimage",
    password: bcrypt.hashSync("testpassword", salt),
    email: "imageuser@example.com",
    role: 1 << 0,
    profileImage: "data:image/png;base64,abc",
}

const contactUserData = {
    username: "userwithcontact",
    password: bcrypt.hashSync("testpassword", salt),
    email: "contactuser@example.com",
    role: 1 << 0,
    deliveryAddress: "Test Address",
    contactNumber: ["123456789"],
}

let users = []
let supportAgents = []
let deliveryAgents = []
for (let i = 0; i < 5; i++) {
    users.push({
        username: `user${i}`,
        password: bcrypt.hashSync("testpassword", salt),
        email: `user${i}@example.com`,
        role: 1 << 0,
    })
    deliveryAgents.push({
        username: `delivery${i}`,
        password: bcrypt.hashSync("testpassword", salt),
        email: `delivery${i}@example.com`,
        role: 1 << 1,
    })
    supportAgents.push({
        username: `support${i}`,
        password: bcrypt.hashSync("testpassword", salt),
        email: `support${i}@example.com`,
        role: 1 << 2,
    })
}

const prepareData = async () => {
    await User.deleteMany({})
    await User.create(adminData)
    await User.create(profileImageUserData)
    await User.create(contactUserData)
    for (let user of users) await User.create(user)
    for (let deliveryAgent of deliveryAgents) await User.create(deliveryAgent)
    for (let supportAgent of supportAgents) await User.create(supportAgent)
}
describe("Users", () => {
    before(async () => {
        await User.deleteMany({})
    })

    after(async () => {
        await User.deleteMany({})
    })

    describe("GET /api/users", () => {
        let userToken, adminToken

        before(async () => {
            await prepareData()
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

    describe("POST /api/users/:username", () => {
        let user3Token, adminToken

        before(async () => {
            await prepareData()
            // log in as a user3
            const loginUser3Response = await request.post("/api/auth/login").send({
                email: "user3@example.com",
                password: "testpassword",
            })
            // log in as administrator to view details
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "adminpassword",
            })
            adminToken = adminLoginResponse.body.body.token
            user3Token = loginUser3Response.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should return profile data for the user", (done) => {
            request
                .get("/api/users/user3")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(200)
                .then((res) => {
                    assert.strictEqual(res.body.body.user.username, "user3")
                    assert.strictEqual(res.body.body.user.email, "user3@example.com")
                    assert.deepEqual(res.body.body.user.role, ["USER"])
                    done()
                })
                .catch(done)
        })

        it("should return 403 forbidden for unauthorized users", (done) => {
            request
                .get("/api/users/user4")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(403)
                .then((res) => {
                    assert.deepEqual(res.body.body, "You are not authorized to view this user")
                    done()
                })
                .catch(done)
        })

        it("should allow administrators to view any user", (done) => {
            request
                .get("/api/users/user3")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.strictEqual(res.body.body.user.username, "user3")
                    assert.strictEqual(res.body.body.user.email, "user3@example.com")
                    assert.deepEqual(res.body.body.user.role, ["USER"])
                    done()
                })
                .catch(done)
        })

        it("should allow users to view delivery agents", (done) => {
            request
                .get("/api/users/delivery0")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(200)
                .then((res) => {
                    assert.strictEqual(res.body.body.user.username, "delivery0")
                    assert.strictEqual(res.body.body.user.email, "delivery0@example.com")
                    assert.deepEqual(res.body.body.user.role, ["DELIVERY_AGENT"])
                    done()
                })
                .catch(done)
        })

        it("should return 404 for non-existent users", (done) => {
            request
                .get("/api/users/nonexistentuser")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(404)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User not found")
                    done()
                })
                .catch(done)
        })
    })

    describe("DELETE /api/users/:username", () => {
        let user3Token, user4Token, adminToken

        before(async () => {
            await prepareData()
            const loginUser3Response = await request.post("/api/auth/login").send({
                email: "user3@example.com",
                password: "testpassword",
            })
            const loginUser4Response = await request.post("/api/auth/login").send({
                email: "user4@example.com",
                password: "testpassword",
            })
            // log in as administrator to view details
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "adminpassword",
            })
            adminToken = adminLoginResponse.body.body.token
            user3Token = loginUser3Response.body.body.token
            user4Token = loginUser4Response.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should successfully delete the user", (done) => {
            request
                .delete("/api/users/user4")
                .set("Authorization", `Bearer ${user4Token}`)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User deleted")
                    // check if the user is deleted
                    return User.findOne({ username: "user4" })
                })
                .then((user) => {
                    assert.ok(!user)
                    done()
                })
                .catch(done)
        })

        it("should return 403 forbidden for unauthorized users", (done) => {
            request
                .delete("/api/users/user1")
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(403)
                .then((res) => {
                    assert.deepEqual(res.body.body, "You cannot delete this user")
                    done()
                })
                .catch(done)
        })

        it("should allow administrators to delete any user", (done) => {
            request
                .delete("/api/users/user3")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User deleted")
                    // check if the user is deleted
                    return User.findOne({ username: "user3" })
                })
                .then((user) => {
                    assert.ok(!user)
                    done()
                })
                .catch(done)
        })

        it("should return 404 for non-existent users", (done) => {
            request
                .delete("/api/users/nonexistentuser")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User not found")
                    done()
                })
                .catch(done)
        })
    })

    describe("PUT /api/users/:username/password", () => {
        let user3Token, user4Token, adminToken

        before(async () => {
            await prepareData()
            const loginUser3Response = await request.post("/api/auth/login").send({
                email: "user3@example.com",
                password: "testpassword",
            })
            const loginUser4Response = await request.post("/api/auth/login").send({
                email: "user4@example.com",
                password: "testpassword",
            })
            // log in as administrator to view details
            const adminLoginResponse = await request.post("/api/auth/login").send({
                email: "admin@example.com",
                password: "adminpassword",
            })
            adminToken = adminLoginResponse.body.body.token
            user3Token = loginUser3Response.body.body.token
            user4Token = loginUser4Response.body.body.token
        })

        after(async () => {
            await User.deleteMany({})
        })

        it("should successfully change the password", (done) => {
            request
                .put("/api/users/user4/password")
                .send({ password: "newpassword" })
                .set("Authorization", `Bearer ${user4Token}`)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.body, "Password changed")
                    // check if the password is changed
                    return User.findOne({ username: "user4" }, "+password")
                })
                .then((user) => {
                    assert.ok(bcrypt.compareSync("newpassword", user.password))
                    done()
                })
                .catch(done)
        })

        it("should return 403 forbidden for unauthorized users", (done) => {
            request
                .put("/api/users/user1/password")
                .send({ password: "newpassword" })
                .set("Authorization", `Bearer ${user3Token}`)
                .expect(403)
                .then((res) => {
                    assert.deepEqual(res.body.body, "You cannot edit this user")
                    done()
                })
                .catch(done)
        })

        it("should allow administrators to change passwords of any user", (done) => {
            request
                .put("/api/users/user3/password")
                .send({ password: "newpassword" })
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((res) => {
                    assert.deepEqual(res.body.body, "Password changed")
                    // check if the password is changed
                    return User.findOne({ username: "user3" }, "+password")
                })
                .then((user) => {
                    assert.ok(bcrypt.compareSync("newpassword", user.password))
                    done()
                })
                .catch(done)
        })

        it("should return 404 for non-existent users", (done) => {
            request
                .put("/api/users/nonexistentuser/password")
                .send({ password: "newpassword" })
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404)
                .then((res) => {
                    assert.deepEqual(res.body.body, "User not found")
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
