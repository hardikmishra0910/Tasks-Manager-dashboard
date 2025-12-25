/**
 * Application Constants
 * Centralized location for all application constants
 */

// Task Status Options
export const TASK_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed'
}

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'All',
  PENDING: 'Pending',
  COMPLETED: 'Completed'
}

// Theme Options
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
}

// API Endpoints
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  HEALTH: '/api/health'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences'
}

// Validation Rules
export const VALIDATION = {
  TASK_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  SEARCH_TERM: {
    MAX_LENGTH: 100
  }
}

// UI Constants
export const UI = {
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error - please check your connection',
  TASK_NOT_FOUND: 'Task not found',
  VALIDATION_FAILED: 'Please check your input and try again',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  TASK_TITLE_REQUIRED: 'Task title is required',
  TASK_TITLE_TOO_LONG: 'Task title cannot exceed 200 characters'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  TASK_STATUS_UPDATED: 'Task status updated successfully!',
  TASKS_REFRESHED: 'Tasks refreshed!'
}

export default {
  TASK_STATUS,
  FILTER_OPTIONS,
  THEME,
  API_ENDPOINTS,
  STORAGE_KEYS,
  VALIDATION,
  UI,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
}