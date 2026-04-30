const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, adminOnly, createTask);
router.get("/project/:projectId", protect, getTasksByProject);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;