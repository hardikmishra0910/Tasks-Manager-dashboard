import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, X, Edit3 } from 'lucide-react'
import { createTask, updateTask } from '../redux/slices/taskSlice'
import toast from 'react-hot-toast'

/**
 * TaskForm Component
 * Handles both creating new tasks and editing existing tasks
 */
const TaskForm = ({ editingTask, onCancel, className = '' }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.tasks)
  
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Pending')
  const [errors, setErrors] = useState({})

  // Set form data when editing a task
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '')
      setStatus(editingTask.status || 'Pending')
    } else {
      setTitle('')
      setStatus('Pending')
    }
    setErrors({})
  }, [editingTask])

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Task title is required'
    } else if (title.trim().length < 1) {
      newErrors.title = 'Task title must be at least 1 character'
    } else if (title.trim().length > 200) {
      newErrors.title = 'Task title cannot exceed 200 characters'
    }

    if (!['Pending', 'Completed'].includes(status)) {
      newErrors.status = 'Please select a valid status'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const taskData = {
      title: title.trim(),
      status
    }

    try {
      if (editingTask) {
        // Update existing task
        await dispatch(updateTask({ 
          id: editingTask._id, 
          taskData 
        })).unwrap()
        
        toast.success('Task updated successfully!')
        onCancel() // Close edit mode
      } else {
        // Create new task
        await dispatch(createTask(taskData)).unwrap()
        
        toast.success('Task created successfully!')
        
        // Reset form
        setTitle('')
        setStatus('Pending')
        setErrors({})
      }
    } catch (error) {
      toast.error(error || 'Something went wrong!')
    }
  }

  // Handle cancel action
  const handleCancel = () => {
    if (editingTask && onCancel) {
      onCancel()
    } else {
      // Reset form for new task
      setTitle('')
      setStatus('Pending')
      setErrors({})
    }
  }

  // Handle input change with real-time validation
  const handleTitleChange = (e) => {
    const value = e.target.value
    setTitle(value)
    
    // Clear title error when user starts typing
    if (errors.title && value.trim()) {
      setErrors(prev => ({ ...prev, title: '' }))
    }
  }

  const isEditing = !!editingTask

  return (
    <div className={`card ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Edit3 className="w-5 h-5 text-primary-600" />
            ) : (
              <Plus className="w-5 h-5 text-primary-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </h3>
          </div>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:ring-gray-500"
              aria-label="Cancel editing"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Task Title Input */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter task title..."
            className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            maxLength={200}
            disabled={loading}
            autoFocus={!isEditing}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {title.length}/200 characters
          </p>
        </div>

        {/* Task Status Select */}
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`input-field ${errors.status ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.status}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 spinner"></div>
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                {isEditing ? (
                  <Edit3 className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{isEditing ? 'Update Task' : 'Add Task'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm