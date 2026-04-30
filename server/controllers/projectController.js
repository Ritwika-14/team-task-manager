const Project = require("../models/Project");


// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline, members } = req.body;

    const project = await Project.create({
      name,
      description,
      deadline,
      members,
      createdBy: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get My Projects
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("members", "name email role")
        .populate("createdBy", "name");
    } else {
      projects = await Project.find({
        members: req.user._id
      })
        .populate("members", "name email role")
        .populate("createdBy", "name");
    }

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};