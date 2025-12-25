import { createSlice } from '@reduxjs/toolkit'

/**
 * Theme Slice - Redux Toolkit slice for theme management
 * Handles light/dark mode toggle with localStorage persistence
 */

// Get initial theme from localStorage or default to light mode
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Check system preference if no saved theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

const initialState = {
  isDarkMode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Toggle between light and dark mode
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light')
      }
    },

    // Set specific theme mode
    setTheme: (state, action) => {
      state.isDarkMode = action.payload
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload ? 'dark' : 'light')
      }
    },

    // Initialize theme from localStorage or system preference
    initializeTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
          state.isDarkMode = savedTheme === 'dark'
        } else {
          // Use system preference if no saved theme
          state.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
          localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light')
        }
      }
    }
  }
})

// Export actions
export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions

// Selectors
export const selectIsDarkMode = (state) => state.theme.isDarkMode
export const selectTheme = (state) => state.theme.isDarkMode ? 'dark' : 'light'

// Export reducer
export default themeSlice.reducer