import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, clearError } from '../redux/slices/taskSlice'
import TaskForm from '../components/TaskForm'
import TaskFilters from '../components/TaskFilters'
import TaskList from '../components/TaskList'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

/**
 * TaskDashboard Component
 * Main dashboard page that orchestrates all task management functionality
 */
const TaskDashboard = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.tasks)
  
  const [editingTask, setEditingTask] = useState(null)

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task)
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      document.getElementById('task-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  // Refresh tasks
  const handleRefresh = () => {
    dispatch(fetchTasks())
    toast.success('Tasks refreshed!')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Task Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organize your tasks, boost productivity, and stay on top of your goals. 
          Create, edit, and track your progress all in one place.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Form and Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Task Form */}
          <div id="task-form">
            <TaskForm 
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
          </div>

          {/* Task Filters */}
          <TaskFilters />

          {/* Quick Actions (Desktop Only) */}
          <div className="hidden lg:block card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 spinner"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <span>Refresh Tasks</span>
                )}
              </button>
              
              {editingTask && (
                <button
                  onClick={handleCancelEdit}
                  className="w-full btn-secondary"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Task List */}
        <div className="lg:col-span-2">
          <TaskList onEditTask={handleEditTask} />
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="lg:hidden fixed bottom-4 right-4 z-10">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-primary rounded-full p-3 shadow-lg"
          aria-label="Refresh tasks"
        >
          {loading ? (
            <div className="w-5 h-5 spinner border-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Global Loading Overlay (for initial load) */}
      {loading && !editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <LoadingSpinner size="lg" message="Loading your tasks..." />
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskDashboard