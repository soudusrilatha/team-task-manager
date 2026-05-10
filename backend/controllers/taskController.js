import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    let query = {};

    if (projectId) {
      query.projectId = projectId;
      
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      
      // If member, check if they are part of the project
      if (req.user.role !== 'ADMIN' && !project.members.some(member => member._id.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
      }

      // If member, only see their assigned tasks within the project
      if (req.user.role !== 'ADMIN') {
        query.assignedTo = req.user._id;
      }
    } else {
      // No project id provided. 
      // If admin, maybe return all tasks (or ask to provide project ID).
      // If member, return all tasks assigned to them.
      if (req.user.role !== 'ADMIN') {
        query.assignedTo = req.user._id;
      }
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('projectId', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add task to this project' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo: assignedTo || null,
      projectId,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'ADMIN') {
      const project = await Project.findById(task.projectId);
      if (project.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update task in this project' });
      }

      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
    } else {
      // Member can only update status if assigned to them
      if (task.assignedTo && task.assignedTo.toString() === req.user._id.toString()) {
        if (req.body.status) {
          task.status = req.body.status;
        }
      } else {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      const project = await Project.findById(task.projectId);
      if (project.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete task in this project' });
      }

      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
