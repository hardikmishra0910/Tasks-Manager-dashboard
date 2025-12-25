import React from 'react'

/**
 * LoadingSpinner Component
 * Reusable loading spinner with optional message
 */
const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  className = '',
  showMessage = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      {/* Spinner */}
      <div 
        className={`spinner ${sizeClasses[size]} border-2 border-gray-300 border-t-primary-600 dark:border-gray-600 dark:border-t-primary-400`}
        role="status"
        aria-label="Loading"
      />
      
      {/* Loading Message */}
      {showMessage && message && (
        <p className={`mt-4 text-gray-600 dark:text-gray-400 ${textSizeClasses[size]} text-center`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner