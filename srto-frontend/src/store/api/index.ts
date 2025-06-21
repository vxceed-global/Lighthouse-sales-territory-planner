// Export the base API
export { srtoApi } from './srtoApi';

// Export all API endpoints and hooks
export * from './outletsApi';
export * from './routesApi';
export * from './territoriesApi';

// Re-export commonly used types from routes API
export type {
  RouteOptimizationRequest,
  RouteOptimizationResult,
} from './routesApi';

// Re-export commonly used types from territories API
export type {
  TerritoryBoundary,
  TerritoryAnalytics,
  TerritorySnapshot,
} from './territoriesApi';
