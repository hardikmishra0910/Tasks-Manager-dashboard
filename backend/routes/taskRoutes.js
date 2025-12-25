const express = require('express');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask
} = require('../middleware/validation');

const router = express.Router();

/**
 * Task Routes
 * All routes are prefixed with /api/tasks
 */

// @route   GET /api/tasks
// @desc    Get all tasks with optional filtering and search
// @access  Public
router.get('/', getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Public
router.get('/:id', getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Public
router.post('/', validateCreateTask, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', validateUpdateTask, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', deleteTask);

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task status between Pending and Completed
// @access  Public
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;