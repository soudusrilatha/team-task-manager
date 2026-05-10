import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, admin, createTask);
router.route('/:id').put(protect, updateTask).delete(protect, admin, deleteTask);

export default router;
