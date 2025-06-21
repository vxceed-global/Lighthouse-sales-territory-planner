import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Territory, TerritoryAssignment } from '../../types/territory.types';

interface TerritoriesState {
  territories: Territory[];
  selectedTerritory: Territory | null;
  loading: boolean;
  error: string | null;
}

const initialState: TerritoriesState = {
  territories: [],
  selectedTerritory: null,
  loading: false,
  error: null,
};

const territoriesSlice = createSlice({
  name: 'territories',
  initialState,
  reducers: {
    setTerritories: (state, action: PayloadAction<Territory[]>) => {
      state.territories = action.payload;
    },
    addTerritory: (state, action: PayloadAction<Territory>) => {
      state.territories.push(action.payload);
    },
    updateTerritory: (state, action: PayloadAction<Territory>) => {
      const index = state.territories.findIndex((territory: Territory) => territory.id === action.payload.id);
      if (index !== -1) {
        state.territories[index] = action.payload;
      }
    },
    removeTerritory: (state, action: PayloadAction<string>) => {
      state.territories = state.territories.filter((territory: Territory) => territory.id !== action.payload);
    },
    selectTerritory: (state, action: PayloadAction<string>) => {
      state.selectedTerritory = state.territories.find((territory: Territory) => territory.id === action.payload) || null;
    },
    clearSelectedTerritory: (state) => {
      state.selectedTerritory = null;
    },
    assignOutletsToTerritory: (_state, action: PayloadAction<TerritoryAssignment>) => {
      // This would typically be handled by an API call and then updating the state
      // For now, we'll just log the assignment
      console.log('Assigning outlets to territory:', action.payload);
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
  setTerritories,
  addTerritory,
  updateTerritory,
  removeTerritory,
  selectTerritory,
  clearSelectedTerritory,
  assignOutletsToTerritory,
  setLoading,
  setError,
} = territoriesSlice.actions;

export default territoriesSlice.reducer;