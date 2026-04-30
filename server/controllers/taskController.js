const Task = require("../models/Task");


// Create Task (Admin)
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignedTo
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Tasks by Project
exports.getTasksByProject = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find({
        projectId: req.params.projectId
      })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");
    } else {
      tasks = await Task.find({
        projectId: req.params.projectId,
        assignedTo: req.user._id
      })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");
    }

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Member can edit only own task status
    if (req.user.role === "member") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Not allowed"
        });
      }

      task.status = req.body.status || task.status;

      await task.save();

      return res.json(task);
    }

    // Admin full update
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Task (Admin)
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};