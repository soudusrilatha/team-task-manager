import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;

    const now = new Date();

    if (req.user.role === 'ADMIN') {
      const projects = await Project.find({ admin: req.user._id });
      const projectIds = projects.map((p) => p._id);

      const tasks = await Task.find({ projectId: { $in: projectIds } });

      totalTasks = tasks.length;
      completedTasks = tasks.filter((t) => t.status === 'Done').length;
      pendingTasks = tasks.filter((t) => t.status === 'Todo' || t.status === 'In Progress').length;
      overdueTasks = tasks.filter((t) => t.status !== 'Done' && new Date(t.dueDate) < now).length;
    } else {
      const tasks = await Task.find({ assignedTo: req.user._id });

      totalTasks = tasks.length;
      completedTasks = tasks.filter((t) => t.status === 'Done').length;
      pendingTasks = tasks.filter((t) => t.status === 'Todo' || t.status === 'In Progress').length;
      overdueTasks = tasks.filter((t) => t.status !== 'Done' && new Date(t.dueDate) < now).length;
    }

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
