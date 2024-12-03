import { configureStore } from '@reduxjs/toolkit'
import { subjectSlice } from './features/subjects/subjectSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      subjectStore: subjectSlice.reducer
    }
  })
};