import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import TaskForm from '../components/TaskForm'
import taskReducer from '../redux/slices/taskSlice'
import themeReducer from '../redux/slices/themeSlice'

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}))

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      tasks: taskReducer,
      theme: themeReducer,
    },
    preloadedState: initialState,
  })
}

// Test wrapper component
const TestWrapper = ({ children, store }) => (
  <Provider store={store}>
    {children}
  </Provider>
)

describe('TaskForm Component', () => {
  let store

  beforeEach(() => {
    store = createTestStore({
      tasks: {
        tasks: [],
        filteredTasks: [],
        loading: false,
        error: null,
        filter: 'All',
        searchTerm: '',
        stats: { total: 0, pending: 0, completed: 0 }
      },
      theme: {
        isDarkMode: false
      }
    })
  })

  test('renders task form with correct elements', () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    expect(screen.getByText('Add New Task')).toBeInTheDocument()
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  test('shows validation error for empty title', async () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument()
    })
  })

  test('allows user to input task title', () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    const titleInput = screen.getByLabelText(/task title/i)
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })

    expect(titleInput.value).toBe('Test Task')
  })

  test('allows user to select task status', () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'Completed' } })

    expect(statusSelect.value).toBe('Completed')
  })

  test('shows character count for title input', () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    const titleInput = screen.getByLabelText(/task title/i)
    fireEvent.change(titleInput, { target: { value: 'Test' } })

    expect(screen.getByText('4/200 characters')).toBeInTheDocument()
  })

  test('renders in edit mode when editingTask is provided', () => {
    const editingTask = {
      _id: '1',
      title: 'Existing Task',
      status: 'Pending'
    }

    render(
      <TestWrapper store={store}>
        <TaskForm editingTask={editingTask} onCancel={jest.fn()} />
      </TestWrapper>
    )

    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  test('calls onCancel when cancel button is clicked in edit mode', () => {
    const mockOnCancel = jest.fn()
    const editingTask = {
      _id: '1',
      title: 'Existing Task',
      status: 'Pending'
    }

    render(
      <TestWrapper store={store}>
        <TaskForm editingTask={editingTask} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  test('disables submit button when loading', () => {
    const loadingStore = createTestStore({
      tasks: {
        tasks: [],
        filteredTasks: [],
        loading: true,
        error: null,
        filter: 'All',
        searchTerm: '',
        stats: { total: 0, pending: 0, completed: 0 }
      },
      theme: {
        isDarkMode: false
      }
    })

    render(
      <TestWrapper store={loadingStore}>
        <TaskForm />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /creating/i })
    expect(submitButton).toBeDisabled()
  })

  test('shows validation error for title exceeding max length', async () => {
    render(
      <TestWrapper store={store}>
        <TaskForm />
      </TestWrapper>
    )

    const titleInput = screen.getByLabelText(/task title/i)
    const longTitle = 'a'.repeat(201) // Exceeds 200 character limit
    
    fireEvent.change(titleInput, { target: { value: longTitle } })
    
    const submitButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Task title cannot exceed 200 characters')).toBeInTheDocument()
    })
  })
})