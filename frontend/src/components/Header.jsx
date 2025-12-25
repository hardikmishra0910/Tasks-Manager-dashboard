import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Moon, Sun, CheckSquare } from 'lucide-react'
import { toggleTheme } from '../redux/slices/themeSlice'

/**
 * Header Component
 * Contains app title, navigation, and theme toggle
 */
const Header = () => {
  const dispatch = useDispatch()
  const { isDarkMode } = useSelector((state) => state.theme)
  const { stats } = useSelector((state) => state.tasks)

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Task Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stay organized and productive
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center space-x-6">
            {/* Task Stats */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Total: <span className="font-medium text-gray-900 dark:text-gray-100">{stats.total}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Pending: <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Completed: <span className="font-medium text-green-600 dark:text-green-400">{stats.completed}</span>
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 focus:ring-gray-500"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="sm:hidden pb-4">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Total: <span className="font-medium text-gray-900 dark:text-gray-100">{stats.total}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Pending: <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Completed: <span className="font-medium text-green-600 dark:text-green-400">{stats.completed}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header