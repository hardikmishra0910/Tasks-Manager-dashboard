import axios from 'axios'

/**
 * Task Service - API service for task operations
 * Handles all HTTP requests to the backend API
 */

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || '/api'
    : 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging and auth (if needed in future)
API.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    })

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error - please check your connection'
    }

    return Promise.reject(error)
  }
)

/**
 * Task Service Object
 * Contains all task-related API methods
 */
const taskService = {
  /**
   * Get all tasks with optional filtering and search
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (All, Pending, Completed)
   * @param {string} params.search - Search term for task titles
   * @param {string} params.sortBy - Sort field (createdAt, updatedAt, title, status)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getAllTasks: async (params = {}) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()
    const url = queryString ? `/tasks?${queryString}` : '/tasks'
    
    return await API.get(url)
  },

  /**
   * Get a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise} API response
   */
  getTaskById: async (id) => {
    if (!id) {
      throw new Error('Task ID is required')
    }
    return await API.get(`/tasks/${id}`)
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title (required)
   * @param {string} taskData.status - Task status (optional, defaults to 'Pending')
   * @returns {Promise} API response
   */
  createTask: async (taskData) => {
    if (!taskData || !taskData.title || !taskData.title.trim()) {
      throw new Error('Task title is required')
    }

    const payload = {
      title: taskData.title.trim(),
      status: taskData.status || 'Pending'
    }

    return await API.post('/tasks', payload)
  },

  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} taskData - Updated task data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.status - Task status
   * @returns {Promise} API response
   */
  updateTask: async (id, taskData) => {
    if (!id) {
      throw new Error('Task ID is required')
    }

    if (!taskData || Object.keys(taskData).length === 0) {
      throw new Error('Task data is required for update')
    }

    const payload = {}
    if (taskData.title !== undefined) {
      payload.title = taskData.title.trim()
    }
    if (taskData.status !== undefined) {
      payload.status = taskData.status
    }

    return await API.put(`/tasks/${id}`, payload)
  },

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise} API response
   */
  deleteTask: async (id) => {
    if (!id) {
      throw new Error('Task ID is required')
    }
    return await API.delete(`/tasks/${id}`)
  },

  /**
   * Toggle task status between Pending and Completed
   * @param {string} id - Task ID
   * @returns {Promise} API response
   */
  toggleTaskStatus: async (id) => {
    if (!id) {
      throw new Error('Task ID is required')
    }
    return await API.patch(`/tasks/${id}/toggle`)
  },

  /**
   * Batch operations (for future use)
   */
  
  /**
   * Delete multiple tasks
   * @param {Array} ids - Array of task IDs
   * @returns {Promise} Array of API responses
   */
  deleteMultipleTasks: async (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('Task IDs array is required')
    }

    const deletePromises = ids.map(id => taskService.deleteTask(id))
    return await Promise.allSettled(deletePromises)
  },

  /**
   * Update multiple tasks status
   * @param {Array} ids - Array of task IDs
   * @param {string} status - New status for all tasks
   * @returns {Promise} Array of API responses
   */
  updateMultipleTasksStatus: async (ids, status) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('Task IDs array is required')
    }

    if (!status || !['Pending', 'Completed'].includes(status)) {
      throw new Error('Valid status is required (Pending or Completed)')
    }

    const updatePromises = ids.map(id => 
      taskService.updateTask(id, { status })
    )
    return await Promise.allSettled(updatePromises)
  }
}

export default taskService