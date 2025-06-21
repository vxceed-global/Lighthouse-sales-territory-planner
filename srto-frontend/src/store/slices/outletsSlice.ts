
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Outlet, OutletFilters } from '../../types/outlet.types';

interface OutletsState {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  filters: OutletFilters;
  loading: boolean;
  error: string | null;
}

const initialState: OutletsState = {
  outlets: [],
  selectedOutlet: null,
  filters: {
    channel: [],
    tier: [],
    territory: [],
    searchTerm: '',
  },
  loading: false,
  error: null,
};

const outletsSlice = createSlice({
  name: 'outlets',
  initialState,
  reducers: {
    setOutlets: (state, action: PayloadAction<Outlet[]>) => {
      state.outlets = action.payload;
    },
    addOutlet: (state, action: PayloadAction<Outlet>) => {
      state.outlets.push(action.payload);
    },
    updateOutlet: (state, action: PayloadAction<Outlet>) => {
      const index = state.outlets.findIndex((outlet: Outlet) => outlet.id === action.payload.id);
      if (index !== -1) {
        state.outlets[index] = action.payload;
      }
    },
    removeOutlet: (state, action: PayloadAction<string>) => {
      state.outlets = state.outlets.filter((outlet: Outlet) => outlet.id !== action.payload);
    },
    selectOutlet: (state, action: PayloadAction<string>) => {
      state.selectedOutlet = state.outlets.find((outlet: Outlet) => outlet.id === action.payload) || null;
    },
    clearSelectedOutlet: (state) => {
      state.selectedOutlet = null;
    },
    setFilters: (state, action: PayloadAction<OutletFilters>) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setOutlets,
  addOutlet,
  updateOutlet,
  removeOutlet,
  selectOutlet,
  clearSelectedOutlet,
  setFilters,
  setLoading,
  setError,
} = outletsSlice.actions;

export default outletsSlice.reducer;

