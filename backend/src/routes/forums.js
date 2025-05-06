const express = require("express")
const router = express.Router()
const ForumThreadReply = require("../models/ForumThreadReply")

const { requireRole, roles } = require("../middlewares/auth")
const {
    createThread,
    getAllThreads,
    getThread,
    editThread,
    deleteThread,
    createReply,
} = require("../controllers/forums")

router.post("/", requireRole(roles.USER), createThread)
router.get("/", getAllThreads)
router.get("/:threadId", getThread)
router.put("/:threadId", requireRole(roles.USER), editThread)
router.delete("/:threadId", requireRole(roles.USER), deleteThread)
router.post("/:threadId/replies", requireRole(roles.USER), createReply)

module.exports = router
