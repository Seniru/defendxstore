const express = require("express")
const router = express.Router()

const { requireRole, roles } = require("../middlewares/auth")
const {
    createThread,
    getAllThreads,
    getThread,
    editThread,
    deleteThread,
} = require("../controllers/forums")

router.post("/", requireRole(roles.USER), createThread)
router.get("/", getAllThreads)
router.get("/:threadId", getThread)
router.put("/:threadId", editThread)
router.delete("/:threadId", deleteThread)
module.exports = router
