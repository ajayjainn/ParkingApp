import { configureStore } from '@reduxjs/toolkit'
import { baseApiSlice } from '../features/api/baseApiSlice'
import authReducer from '../features/auth/authSlice.js'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    [baseApiSlice.reducerPath]:baseApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),

})