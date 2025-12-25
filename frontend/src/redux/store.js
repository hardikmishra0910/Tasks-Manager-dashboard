import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './slices/taskSlice'
import themeReducer from './slices/themeSlice'

/**
 * Redux Store Configuration
 * Combines all reducers and configures the store with Redux Toolkit
 */
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store