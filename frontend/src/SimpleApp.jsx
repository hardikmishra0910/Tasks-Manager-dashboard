import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { initializeTheme } from './redux/slices/themeSlice'

/**
 * Enhanced Task Management Dashboard - Complete with all features
 */
function SimpleApp() {
  const dispatch = useDispatch()
  const { isDarkMode } = useSelector((state) => state.theme)
  
  // Local state for tasks
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Edit and view states
  const [editingTask, setEditingTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [editPriority, setEditPriority] = useState('Medium')

  // Initialize theme on app load
  useEffect(() => {
    dispatch(initializeTheme())
  }, [dispatch])

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Add new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        deadline: newTaskDeadline,
        priority: newTaskPriority,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([newTask, ...tasks])
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskDeadline('')
      setNewTaskPriority('Medium')
      alert('✅ Task created successfully!')
    }
  }

  // Start editing task
  const startEdit = (task) => {
    setEditingTask(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditDeadline(task.deadline)
    setEditPriority(task.priority)
    setViewingTask(null) // Close details view if open
  }

  // Save edited task
  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask 
        ? { 
            ...task, 
            title: editTitle.trim(),
            description: editDescription.trim(),
            deadline: editDeadline,
            priority: editPriority,
            updatedAt: new Date().toISOString()
          }
        : task
    ))
    setEditingTask(null)
    alert('✅ Task updated successfully!')
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDescription('')
    setEditDeadline('')
    setEditPriority('Medium')
  }

  // Toggle task status
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'Pending' ? 'Completed' : 'Pending',
            updatedAt: new Date().toISOString()
          }
        : task
    ))
  }

  // Mark task as complete
  const markComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: 'Completed', updatedAt: new Date().toISOString() }
        : task
    ))
    alert('✅ Task marked as completed!')
  }

  // Mark task as pending
  const markPending = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() }
        : task
    ))
    alert('🔄 Task marked as pending!')
  }

  // Delete task
  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id))
      setViewingTask(null) // Close details if viewing deleted task
      setEditingTask(null) // Cancel edit if editing deleted task
      alert('🗑️ Task deleted successfully!')
    }
  }

  // View task details
  const viewTask = (task) => {
    setViewingTask(task)
    setEditingTask(null) // Cancel edit if editing
  }

  // Close task details
  const closeTaskDetails = () => {
    setViewingTask(null)
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  // Check if task is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline'
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays === -1) return 'Due yesterday'
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
    if (diffDays > 0) return `Due in ${diffDays} days`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Enhanced Task Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete task management with deadlines & descriptions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total: <span className="font-medium text-gray-900 dark:text-gray-100">{stats.total}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Pending: <span className="font-medium text-yellow-600">{stats.pending}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Completed: <span className="font-medium text-green-600">{stats.completed}</span>
                </span>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={() => dispatch({ type: 'theme/toggleTheme' })}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto">
              {/* Page Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Enhanced Task Management Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete task management with deadlines, descriptions, priorities, and detailed views.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Task Form and Filters */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Add Task Form */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <span className="text-blue-600 mr-2">+</span>
                      Add New Task
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Task Title *
                        </label>
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Enter task title..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          placeholder="Enter task description..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={newTaskDeadline}
                          onChange={(e) => setNewTaskDeadline(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={addTask}
                        disabled={!newTaskTitle.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <span className="text-blue-600 mr-2">🔍</span>
                      Filters & Search
                    </h3>
                    
                    {/* Search */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Pending', 'Completed'].map((filterOption) => (
                          <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              filter === filterOption
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {filterOption}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Task List */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Tasks ({filteredTasks.length})
                    </h3>
                    
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {tasks.length === 0 
                            ? 'Get started by creating your first task with description and deadline!'
                            : 'Try adjusting your filters or search term.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            {editingTask === task.id ? (
                              /* Edit Mode */
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Deadline
                                    </label>
                                    <input
                                      type="date"
                                      value={editDeadline}
                                      onChange={(e) => setEditDeadline(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Priority
                                    </label>
                                    <select
                                      value={editPriority}
                                      onChange={(e) => setEditPriority(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="Low">Low</option>
                                      <option value="Medium">Medium</option>
                                      <option value="High">High</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={saveEdit}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                  >
                                    💾 Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                  >
                                    ❌ Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* View Mode */
                              <div>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <button
                                      onClick={() => toggleTask(task.id)}
                                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                        task.status === 'Completed'
                                          ? 'bg-green-600 border-green-600 text-white'
                                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                                      }`}
                                    >
                                      {task.status === 'Completed' && '✓'}
                                    </button>
                                    <div className="flex-1">
                                      <h4 className={`font-medium text-lg ${
                                        task.status === 'Completed'
                                          ? 'line-through text-gray-500 dark:text-gray-400'
                                          : 'text-gray-900 dark:text-gray-100'
                                      }`}>
                                        {task.title}
                                      </h4>
                                      {task.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                          {task.description.length > 100 
                                            ? `${task.description.substring(0, 100)}...` 
                                            : task.description
                                          }
                                        </p>
                                      )}
                                      <div className="flex items-center space-x-4 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                          {task.priority} Priority
                                        </span>
                                        {task.deadline && (
                                          <span className={`text-sm ${
                                            isOverdue(task.deadline) 
                                              ? 'text-red-600 dark:text-red-400 font-medium' 
                                              : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            📅 {formatDate(task.deadline)}
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-400">
                                          Created {new Date(task.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center justify-between">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => viewTask(task)}
                                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                    >
                                      👁️ View Details
                                    </button>
                                    <button
                                      onClick={() => startEdit(task)}
                                      className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                                    >
                                      ✏️ Edit
                                    </button>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    {task.status === 'Pending' ? (
                                      <button
                                        onClick={() => markComplete(task.id)}
                                        className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                                      >
                                        ✅ Mark Complete
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => markPending(task.id)}
                                        className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                                      >
                                        🔄 Mark Pending
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>

      {/* Task Details Modal */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  📋 Task Details
                </h3>
                <button
                  onClick={closeTaskDetails}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {viewingTask.title}
                  </p>
                </div>
                
                {viewingTask.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {viewingTask.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      viewingTask.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {viewingTask.status === 'Completed' ? '✅' : '🔄'} {viewingTask.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(viewingTask.priority)}`}>
                      {viewingTask.priority} Priority
                    </span>
                  </div>
                </div>
                
                {viewingTask.deadline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deadline
                    </label>
                    <p className={`text-lg ${
                      isOverdue(viewingTask.deadline) 
                        ? 'text-red-600 dark:text-red-400 font-medium' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      📅 {formatDate(viewingTask.deadline)}
                      {isOverdue(viewingTask.deadline) && ' (Overdue)'}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <label className="block font-medium mb-1">Created</label>
                    <p>{new Date(viewingTask.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Last Updated</label>
                    <p>{new Date(viewingTask.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    closeTaskDetails()
                    startEdit(viewingTask)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  ✏️ Edit Task
                </button>
                <button
                  onClick={closeTaskDetails}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Enhanced Task Management Dashboard. Built with React & Redux Toolkit.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SimpleApp