import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DummyState {
  value: number
}

const initialState: DummyState = {
  value: 0,
}

const dummySlice = createSlice({
  name: 'dummy',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = dummySlice.actions
export default dummySlice.reducer
