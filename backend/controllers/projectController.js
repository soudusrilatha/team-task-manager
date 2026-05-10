import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await Project.find({ admin: req.user._id }).populate('admin', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('admin', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('admin', 'name email').populate('members', 'name email');

    if (project) {
      // Check access
      if (req.user.role !== 'ADMIN' && !project.members.some(member => member._id.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to view this project' });
      }
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      admin: req.user._id,
      members: members || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }

      project.name = name || project.name;
      project.description = description || project.description;
      project.members = members || project.members;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this project' });
      }

      await Task.deleteMany({ projectId: project._id });
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
