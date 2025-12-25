const { body } = require('express-validator');

/**
 * Validation middleware for task operations
 * Uses express-validator for robust input validation
 */

/**
 * Validation rules for creating a new task
 */
const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters')
    .escape(), // Sanitize HTML entities
  
  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be either Pending or Completed')
];

/**
 * Validation rules for updating a task
 */
const validateUpdateTask = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters')
    .escape(),
  
  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be either Pending or Completed')
];

/**
 * Validation rules for query parameters
 */
const validateQueryParams = [
  body('status')
    .optional()
    .isIn(['All', 'Pending', 'Completed'])
    .withMessage('Status filter must be All, Pending, or Completed'),
  
  body('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters')
    .escape(),
  
  body('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'status'])
    .withMessage('Sort field must be createdAt, updatedAt, title, or status'),
  
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateQueryParams
};