import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Header from './components/Header'
import TaskDashboard from './pages/TaskDashboard'
import { initializeTheme } from './redux/slices/themeSlice'

/**
 * Complete App Component
 */
function App() {
  const dispatch = useDispatch()
  const { isDarkMode } = useSelector((state) => state.theme)

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
          <Route path="/tasks" element={<TaskDashboard />} />
          <Route path="*" element={
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The page you're looking for doesn't exist.
              </p>
              <a 
                href="/" 
                className="btn-primary inline-block"
              >
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Task Management Dashboard. Built with React & Redux Toolkit.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App