const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, adminOnly, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;