import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, X, Filter } from 'lucide-react'
import { setFilter, setSearchTerm, clearFilters } from '../redux/slices/taskSlice'

/**
 * TaskFilters Component
 * Handles task filtering by status and search functionality
 */
const TaskFilters = () => {
  const dispatch = useDispatch()
  const { filter, searchTerm, stats } = useSelector((state) => state.tasks)

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter))
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value))
  }

  // Clear search term
  const clearSearch = () => {
    dispatch(setSearchTerm(''))
  }

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  // Check if any filters are active
  const hasActiveFilters = filter !== 'All' || searchTerm.trim()

  const filterOptions = [
    { 
      key: 'All', 
      label: 'All Tasks', 
      count: stats.total,
      color: 'text-gray-600 dark:text-gray-400'
    },
    { 
      key: 'Pending', 
      label: 'Pending', 
      count: stats.pending,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      key: 'Completed', 
      label: 'Completed', 
      count: stats.completed,
      color: 'text-green-600 dark:text-green-400'
    }
  ]

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters & Search
          </h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input-field pl-10 pr-10"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by Status
        </label>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleFilterChange(option.key)}
              className={`${
                filter === option.key
                  ? 'filter-btn-active'
                  : 'filter-btn-inactive'
              } flex items-center space-x-2`}
            >
              <span>{option.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === option.key
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-100 dark:bg-gray-600'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
            
            {filter !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                Status: {filter}
                <button
                  onClick={() => handleFilterChange('All')}
                  className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  aria-label={`Remove ${filter} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {searchTerm.trim() && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                Search: "{searchTerm}"
                <button
                  onClick={clearSearch}
                  className="ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskFilters