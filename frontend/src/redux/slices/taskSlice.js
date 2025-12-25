import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import taskService from '../../services/taskService'

/**
 * Task Slice - Redux Toolkit slice for task management
 * Handles all task-related state and async operations
 */

// Initial state
const initialState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filter: 'All', // All, Pending, Completed
  searchTerm: '',
  stats: {
    total: 0,
    pending: 0,
    completed: 0
  }
}

// Async thunks for API calls

/**
 * Fetch all tasks from the API
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getAllTasks()
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      )
    }
  }
)

/**
 * Create a new task
 */
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      )
    }
  }
)

/**
 * Update an existing task
 */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      )
    }
  }
)

/**
 * Delete a task
 */
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      )
    }
  }
)

/**
 * Toggle task status between Pending and Completed
 */
export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await taskService.toggleTaskStatus(id)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle task status'
      )
    }
  }
)

// Helper function to filter tasks based on current filter and search term
const filterTasks = (tasks, filter, searchTerm) => {
  let filtered = tasks

  // Apply status filter
  if (filter !== 'All') {
    filtered = filtered.filter(task => task.status === filter)
  }

  // Apply search filter
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase().trim()
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

// Helper function to calculate task statistics
const calculateStats = (tasks) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    completed: tasks.filter(task => task.status === 'Completed').length
  }
  return stats
}

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set filter for tasks (All, Pending, Completed)
    setFilter: (state, action) => {
      state.filter = action.payload
      state.filteredTasks = filterTasks(state.tasks, action.payload, state.searchTerm)
    },

    // Set search term for tasks
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.filteredTasks = filterTasks(state.tasks, state.filter, action.payload)
    },

    // Clear all filters and search
    clearFilters: (state) => {
      state.filter = 'All'
      state.searchTerm = ''
      state.filteredTasks = state.tasks
    },

    // Clear error state
    clearError: (state) => {
      state.error = null
    },

    // Reset task state
    resetTaskState: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload.data || []
        state.stats = action.payload.stats || calculateStats(state.tasks)
        state.filteredTasks = filterTasks(state.tasks, state.filter, state.searchTerm)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        const newTask = action.payload.data
        state.tasks.unshift(newTask) // Add to beginning of array
        state.stats = calculateStats(state.tasks)
        state.filteredTasks = filterTasks(state.tasks, state.filter, state.searchTerm)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.data
        const index = state.tasks.findIndex(task => task._id === updatedTask._id)
        if (index !== -1) {
          state.tasks[index] = updatedTask
          state.stats = calculateStats(state.tasks)
          state.filteredTasks = filterTasks(state.tasks, state.filter, state.searchTerm)
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload
        state.tasks = state.tasks.filter(task => task._id !== taskId)
        state.stats = calculateStats(state.tasks)
        state.filteredTasks = filterTasks(state.tasks, state.filter, state.searchTerm)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload
      })

      // Toggle task status
      .addCase(toggleTaskStatus.pending, (state) => {
        state.error = null
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload.data
        const index = state.tasks.findIndex(task => task._id === updatedTask._id)
        if (index !== -1) {
          state.tasks[index] = updatedTask
          state.stats = calculateStats(state.tasks)
          state.filteredTasks = filterTasks(state.tasks, state.filter, state.searchTerm)
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

// Export actions
export const {
  setFilter,
  setSearchTerm,
  clearFilters,
  clearError,
  resetTaskState
} = taskSlice.actions

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks
export const selectFilteredTasks = (state) => state.tasks.filteredTasks
export const selectTasksLoading = (state) => state.tasks.loading
export const selectTasksError = (state) => state.tasks.error
export const selectTasksFilter = (state) => state.tasks.filter
export const selectTasksSearchTerm = (state) => state.tasks.searchTerm
export const selectTasksStats = (state) => state.tasks.stats

// Export reducer
export default taskSlice.reducer