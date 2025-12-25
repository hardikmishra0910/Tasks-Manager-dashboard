import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Edit3, Trash2, Check, Clock, MoreVertical } from 'lucide-react'
import { deleteTask, toggleTaskStatus } from '../redux/slices/taskSlice'
import toast from 'react-hot-toast'

/**
 * TaskItem Component
 * Individual task item with actions (edit, delete, toggle status)
 */
const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch()
  const [showActions, setShowActions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // Handle task deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsDeleting(true)
    try {
      await dispatch(deleteTask(task._id)).unwrap()
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error(error || 'Failed to delete task')
    } finally {
      setIsDeleting(false)
      setShowActions(false)
    }
  }

  // Handle status toggle
  const handleToggleStatus = async () => {
    setIsToggling(true)
    try {
      await dispatch(toggleTaskStatus(task._id)).unwrap()
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending'
      toast.success(`Task marked as ${newStatus.toLowerCase()}!`)
    } catch (error) {
      toast.error(error || 'Failed to update task status')
    } finally {
      setIsToggling(false)
    }
  }

  // Handle edit action
  const handleEdit = () => {
    onEdit(task)
    setShowActions(false)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const isCompleted = task.status === 'Completed'

  return (
    <div className={`card-hover group relative ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        {/* Task Content */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Status Toggle Button */}
          <button
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isCompleted
                ? 'bg-green-600 border-green-600 text-white focus:ring-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 focus:ring-green-500'
            }`}
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isToggling ? (
              <div className="w-3 h-3 spinner border-white"></div>
            ) : isCompleted ? (
              <Check className="w-3 h-3" />
            ) : null}
          </button>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium break-words ${
              isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {/* Status Badge */}
              <span className={isCompleted ? 'status-completed' : 'status-pending'}>
                {isCompleted ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {task.status}
              </span>
              
              {/* Created Date */}
              <span>
                Created {formatDate(task.createdAt)}
              </span>
              
              {/* Updated Date (if different from created) */}
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <span>
                  Updated {formatDate(task.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 relative">
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="btn-icon text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:ring-primary-500"
              aria-label="Edit task"
              title="Edit task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-icon text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:ring-red-500"
              aria-label="Delete task"
              title="Delete task"
            >
              {isDeleting ? (
                <div className="w-4 h-4 spinner border-red-600"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Actions Menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowActions(!showActions)}
              className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:ring-gray-500"
              aria-label="Task actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Mobile Actions Dropdown */}
            {showActions && (
              <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 spinner border-red-600"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close mobile menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}

export default TaskItem