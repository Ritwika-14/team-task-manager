const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    // ADMIN DASHBOARD
    if (req.user.role === "admin") {
      const totalProjects = await Project.countDocuments();

      const totalTasks = await Task.countDocuments();

      const completedTasks = await Task.countDocuments({
        status: "done"
      });

      const pendingTasks = await Task.countDocuments({
        status: { $ne: "done" }
      });

      const overdueTasks = await Task.countDocuments({
        status: { $ne: "done" },
        dueDate: { $lt: today }
      });

      const highPriorityTasks = await Task.countDocuments({
        priority: "high",
        status: { $ne: "done" }
      });

      return res.json({
        role: "admin",
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        highPriorityTasks
      });
    }

    // MEMBER DASHBOARD
    const myTasks = await Task.countDocuments({
      assignedTo: req.user._id
    });

    const completedMyTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: "done"
    });

    const pendingMyTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: { $ne: "done" }
    });

    const overdueMyTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: { $ne: "done" },
      dueDate: { $lt: today }
    });

    const inProgressTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      status: "in-progress"
    });

    res.json({
      role: "member",
      myTasks,
      completedMyTasks,
      pendingMyTasks,
      overdueMyTasks,
      inProgressTasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};