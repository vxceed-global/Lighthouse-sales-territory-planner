// Export store and types
export * from './store';

// Export all API hooks and endpoints
export * from './api';

// Export slice actions and selectors (with explicit naming to avoid conflicts)
export * from './slices/authSlice';
export {
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
  // Selectors
  selectOutletFilters,
  selectSelectedOutletIds,
  selectSelectedOutlet,
  selectOutletViewMode,
  selectOutletSorting,
  selectMapBounds,
  selectBulkOperationState,
  selectActiveImportSession,
  selectHasActiveFilters,
  selectSelectedOutletCount,
  selectCanPerformBulkOperations,
} from './slices/outletsSlice';
// Export other slices without conflicts
export {
  default as routesReducer,
} from './slices/routesSlice';
export {
  default as territoriesReducer,
} from './slices/territoriesSlice';
export {
  default as optimizationReducer,
} from './slices/optimizationSlice';
export {
  default as uiReducer,
} from './slices/uiSlice';
