const express = require("express");
const router = express.Router();

const { getMembers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/members", protect, adminOnly, getMembers);

module.exports = router;