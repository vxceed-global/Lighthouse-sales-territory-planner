
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OptimizationResult, OptimizationHistory } from '../../types/optimization.types';

interface OptimizationState {
  currentOptimization: OptimizationResult | null;
  optimizationHistory: OptimizationHistory[];
  isOptimizing: boolean;
  error: string | null;
}

const initialState: OptimizationState = {
  currentOptimization: null,
  optimizationHistory: [],
  isOptimizing: false,
  error: null,
};

const optimizationSlice = createSlice({
  name: 'optimization',
  initialState,
  reducers: {
    setOptimizing: (state, action: PayloadAction<boolean>) => {
      state.isOptimizing = action.payload;
      if (action.payload === true) {
        state.error = null;
      }
    },
    setCurrentOptimization: (state, action: PayloadAction<OptimizationResult>) => {
      state.currentOptimization = action.payload;
      state.isOptimizing = false;
    },
    addToHistory: (state, action: PayloadAction<OptimizationHistory>) => {
      state.optimizationHistory.unshift(action.payload);
    },
    clearCurrentOptimization: (state) => {
      state.currentOptimization = null;
    },
    setOptimizationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isOptimizing = false;
    },
  },
});

export const {
  setOptimizing,
  setCurrentOptimization,
  addToHistory,
  clearCurrentOptimization,
  setOptimizationError,
} = optimizationSlice.actions;

export default optimizationSlice.reducer;

