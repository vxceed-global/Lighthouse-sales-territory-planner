
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { Outlet, OutletFilters, ImportSession } from '../../types';
import type { RootState } from '../store';

interface OutletsState {
  // Local state for UI interactions
  selectedOutletIds: string[];
  selectedOutlet: Outlet | null;
  filters: OutletFilters;

  // UI state
  viewMode: 'list' | 'map' | 'grid';
  sortBy: 'name' | 'tier' | 'salesVolume' | 'lastVisit' | 'distance';
  sortOrder: 'asc' | 'desc';

  // Bulk operations
  bulkOperationInProgress: boolean;
  bulkOperationType: 'delete' | 'assign' | 'update' | null;

  // Import state
  activeImportSession: ImportSession | null;

  // Map state
  mapBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;

  // Cache for performance
  lastFetchTimestamp: number | null;

  // Legacy loading/error (kept for backward compatibility)
  loading: boolean;
  error: string | null;
}

const initialState: OutletsState = {
  selectedOutletIds: [],
  selectedOutlet: null,
  filters: {
    channel: [],
    tier: [],
    territory: [],
    searchTerm: '',
  },
  viewMode: 'list',
  sortBy: 'name',
  sortOrder: 'asc',
  bulkOperationInProgress: false,
  bulkOperationType: null,
  activeImportSession: null,
  mapBounds: null,
  lastFetchTimestamp: null,
  loading: false,
  error: null,
};

const outletsSlice = createSlice({
  name: 'outlets',
  initialState,
  reducers: {
    // Selection management
    selectOutlet: (state, action: PayloadAction<Outlet | null>) => {
      state.selectedOutlet = action.payload;
    },
    selectOutletById: (state, action: PayloadAction<string>) => {
      // This will be used with RTK Query data
      state.selectedOutletIds = [action.payload];
    },
    selectMultipleOutlets: (state, action: PayloadAction<string[]>) => {
      state.selectedOutletIds = action.payload;
    },
    toggleOutletSelection: (state, action: PayloadAction<string>) => {
      const outletId = action.payload;
      const index = state.selectedOutletIds.indexOf(outletId);
      if (index > -1) {
        state.selectedOutletIds.splice(index, 1);
      } else {
        state.selectedOutletIds.push(outletId);
      }
    },
    clearSelection: (state) => {
      state.selectedOutletIds = [];
      state.selectedOutlet = null;
    },

    // Filter management
    setFilters: (state, action: PayloadAction<OutletFilters>) => {
      state.filters = action.payload;
      state.lastFetchTimestamp = null; // Force refetch with new filters
    },
    updateFilter: (state, action: PayloadAction<{ key: keyof OutletFilters; value: any }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
      state.lastFetchTimestamp = null;
    },
    clearFilters: (state) => {
      state.filters = {
        channel: [],
        tier: [],
        territory: [],
        searchTerm: '',
      };
      state.lastFetchTimestamp = null;
    },

    // View management
    setViewMode: (state, action: PayloadAction<'list' | 'map' | 'grid'>) => {
      state.viewMode = action.payload;
    },
    setSorting: (state, action: PayloadAction<{
      sortBy: OutletsState['sortBy'];
      sortOrder: 'asc' | 'desc';
    }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    // Map management
    setMapBounds: (state, action: PayloadAction<OutletsState['mapBounds']>) => {
      state.mapBounds = action.payload;
    },

    // Bulk operations
    startBulkOperation: (state, action: PayloadAction<'delete' | 'assign' | 'update'>) => {
      state.bulkOperationInProgress = true;
      state.bulkOperationType = action.payload;
    },
    completeBulkOperation: (state) => {
      state.bulkOperationInProgress = false;
      state.bulkOperationType = null;
      state.selectedOutletIds = []; // Clear selection after bulk operation
    },

    // Import management
    setActiveImportSession: (state, action: PayloadAction<ImportSession | null>) => {
      state.activeImportSession = action.payload;
    },

    // Cache management
    updateLastFetchTimestamp: (state) => {
      state.lastFetchTimestamp = Date.now();
    },

    // Legacy actions (kept for backward compatibility)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  selectOutlet,
  selectOutletById,
  selectMultipleOutlets,
  toggleOutletSelection,
  clearSelection,
  setFilters,
  updateFilter,
  clearFilters,
  setViewMode,
  setSorting,
  setMapBounds,
  startBulkOperation,
  completeBulkOperation,
  setActiveImportSession,
  updateLastFetchTimestamp,
  setLoading,
  setError,
} = outletsSlice.actions;

export default outletsSlice.reducer;

// Selectors
export const selectOutletFilters = (state: RootState) => state.outlets.filters;
export const selectSelectedOutletIds = (state: RootState) => state.outlets.selectedOutletIds;
export const selectSelectedOutlet = (state: RootState) => state.outlets.selectedOutlet;
export const selectOutletViewMode = (state: RootState) => state.outlets.viewMode;
export const selectOutletSorting = (state: RootState) => ({
  sortBy: state.outlets.sortBy,
  sortOrder: state.outlets.sortOrder,
});
export const selectMapBounds = (state: RootState) => state.outlets.mapBounds;
export const selectBulkOperationState = (state: RootState) => ({
  inProgress: state.outlets.bulkOperationInProgress,
  type: state.outlets.bulkOperationType,
});
export const selectActiveImportSession = (state: RootState) => state.outlets.activeImportSession;

// Computed selectors
export const selectHasActiveFilters = createSelector(
  [selectOutletFilters],
  (filters) => {
    return (
      (filters.searchTerm || '') !== '' ||
      (filters.channel?.length || 0) > 0 ||
      (filters.tier?.length || 0) > 0 ||
      (filters.territory?.length || 0) > 0
    );
  }
);

export const selectSelectedOutletCount = createSelector(
  [selectSelectedOutletIds],
  (selectedIds) => selectedIds.length
);

export const selectCanPerformBulkOperations = createSelector(
  [selectSelectedOutletIds, selectBulkOperationState],
  (selectedIds, bulkState) => selectedIds.length > 0 && !bulkState.inProgress
);

