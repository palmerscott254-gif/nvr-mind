import { configureStore } from '@reduxjs/toolkit'
import dummyReducer from './slices/dummySlice'

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
