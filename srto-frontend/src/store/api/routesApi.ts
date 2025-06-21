import { srtoApi } from './srtoApi';
import type { 
  Route, 
  RouteWithDetails,
  OptimizationParams,
  ApiResponse, 
  PaginatedResponse,
  BulkOperationResponse
} from '../../types';

// Route optimization request type
export interface RouteOptimizationRequest {
  territoryId: string;
  outletIds: string[];
  constraints: {
    maxRouteTime: number; // in minutes
    maxOutletsPerRoute: number;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    vehicleType: 'motorcycle' | 'car' | 'van' | 'truck';
    includeNPPD: boolean;
    prioritizeTier: boolean;
  };
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  manualAssignments?: Array<{
    outletId: string;
    sequence: number;
  }>;
}

export interface RouteOptimizationResult {
  routes: RouteWithDetails[];
  unassignedOutlets: string[];
  metrics: {
    totalDistance: number;
    totalTime: number;
    efficiency: number;
    fuelConsumption: number;
    co2Emissions: number;
  };
  warnings?: string[];
}

// Extend the base API with routes endpoints
export const routesApi = srtoApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated routes
    getRoutes: builder.query<PaginatedResponse<Route>, {
      page?: number;
      limit?: number;
      territoryId?: string;
      status?: string;
      dateRange?: { startDate: string; endDate: string };
    }>({
      query: ({ page = 1, limit = 50, territoryId, status, dateRange }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (territoryId) params.append('territoryId', territoryId);
        if (status) params.append('status', status);
        if (dateRange) {
          params.append('startDate', dateRange.startDate);
          params.append('endDate', dateRange.endDate);
        }

        return `routes?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Routes' as const, id })),
              { type: 'Routes', id: 'LIST' },
            ]
          : [{ type: 'Routes', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single route with details
    getRoute: builder.query<ApiResponse<RouteWithDetails>, string>({
      query: (id) => `routes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Routes', id }],
    }),

    // Create new route
    createRoute: builder.mutation<ApiResponse<Route>, Partial<Route>>({
      query: (route) => ({
        url: 'routes',
        method: 'POST',
        body: route,
      }),
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
      // Optimistic update
      onQueryStarted: async (route, { dispatch, queryFulfilled }) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticRoute = { 
          ...route, 
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Route;

        const patchResult = dispatch(
          routesApi.util.updateQueryData('getRoutes', { page: 1, limit: 50 }, (draft) => {
            draft.data.unshift(optimisticRoute);
            draft.pagination.total += 1;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update existing route
    updateRoute: builder.mutation<ApiResponse<Route>, { id: string; route: Partial<Route> }>({
      query: ({ id, route }) => ({
        url: `routes/${id}`,
        method: 'PUT',
        body: route,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Routes', id },
        { type: 'Routes', id: 'LIST' },
      ],
    }),

    // Delete route
    deleteRoute: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Routes', id },
        { type: 'Routes', id: 'LIST' },
      ],
    }),

    // Route optimization
    optimizeRoute: builder.mutation<ApiResponse<RouteOptimizationResult>, RouteOptimizationRequest>({
      query: (request) => ({
        url: 'routes/optimize',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }, { type: 'Optimization' }],
      // Handle long-running optimization
      onQueryStarted: async (request, { dispatch, queryFulfilled }) => {
        // Set optimization status to loading
        dispatch(
          routesApi.util.updateQueryData('getOptimizationStatus', request.territoryId, (draft) => {
            if (draft.data) {
              draft.data.status = 'processing';
              draft.data.progress = 0;
            }
          })
        );

        try {
          const result = await queryFulfilled;
          // Update optimization status to completed
          dispatch(
            routesApi.util.updateQueryData('getOptimizationStatus', request.territoryId, (draft) => {
              if (draft.data) {
                draft.data.status = 'completed';
                draft.data.progress = 100;
                draft.data.result = result.data.data;
              }
            })
          );
        } catch (error) {
          // Update optimization status to failed
          dispatch(
            routesApi.util.updateQueryData('getOptimizationStatus', request.territoryId, (draft) => {
              if (draft.data) {
                draft.data.status = 'failed';
                draft.data.error = 'Optimization failed';
              }
            })
          );
        }
      },
    }),

    // Get optimization status
    getOptimizationStatus: builder.query<ApiResponse<{
      status: 'idle' | 'processing' | 'completed' | 'failed';
      progress: number;
      result?: RouteOptimizationResult;
      error?: string;
    }>, string>({
      query: (territoryId) => `routes/optimize/status/${territoryId}`,
      providesTags: (_result, _error, territoryId) => [
        { type: 'Optimization', id: territoryId }
      ],
      // Poll every 2 seconds during optimization
      pollingInterval: (args, { getState }) => {
        const status = (getState() as any).srtoApi.queries[`getOptimizationStatus(${JSON.stringify(args)})`]?.data?.data;
        return status?.status === 'processing' ? 2000 : 0;
      },
    }),

    // Manual route adjustments
    updateRouteSequence: builder.mutation<ApiResponse<RouteWithDetails>, {
      routeId: string;
      outletSequence: Array<{ outletId: string; sequence: number }>;
      reason?: string;
    }>({
      query: ({ routeId, outletSequence, reason }) => ({
        url: `routes/${routeId}/sequence`,
        method: 'PUT',
        body: { outletSequence, reason },
      }),
      invalidatesTags: (_result, _error, { routeId }) => [
        { type: 'Routes', id: routeId },
        { type: 'Routes', id: 'LIST' },
      ],
    }),

    // Add outlets to route
    addOutletsToRoute: builder.mutation<ApiResponse<RouteWithDetails>, {
      routeId: string;
      outletIds: string[];
      insertAfter?: number; // sequence number to insert after
    }>({
      query: ({ routeId, outletIds, insertAfter }) => ({
        url: `routes/${routeId}/outlets`,
        method: 'POST',
        body: { outletIds, insertAfter },
      }),
      invalidatesTags: (_result, _error, { routeId }) => [
        { type: 'Routes', id: routeId },
        { type: 'Routes', id: 'LIST' },
        { type: 'Outlets', id: 'LIST' },
      ],
    }),

    // Remove outlets from route
    removeOutletsFromRoute: builder.mutation<ApiResponse<RouteWithDetails>, {
      routeId: string;
      outletIds: string[];
    }>({
      query: ({ routeId, outletIds }) => ({
        url: `routes/${routeId}/outlets`,
        method: 'DELETE',
        body: { outletIds },
      }),
      invalidatesTags: (_result, _error, { routeId }) => [
        { type: 'Routes', id: routeId },
        { type: 'Routes', id: 'LIST' },
        { type: 'Outlets', id: 'LIST' },
      ],
    }),

    // Get routes by territory
    getRoutesByTerritory: builder.query<ApiResponse<Route[]>, string>({
      query: (territoryId) => `routes/territory/${territoryId}`,
      providesTags: (result, _error, territoryId) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Routes' as const, id })),
              { type: 'Routes', id: `TERRITORY_${territoryId}` },
            ]
          : [{ type: 'Routes', id: `TERRITORY_${territoryId}` }],
    }),

    // Duplicate route
    duplicateRoute: builder.mutation<ApiResponse<Route>, {
      routeId: string;
      newName: string;
      newDate?: string;
    }>({
      query: ({ routeId, newName, newDate }) => ({
        url: `routes/${routeId}/duplicate`,
        method: 'POST',
        body: { newName, newDate },
      }),
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
    }),

    // Export route
    exportRoute: builder.mutation<Blob, {
      routeId: string;
      format: 'pdf' | 'excel' | 'csv';
      includeMap: boolean;
    }>({
      query: ({ routeId, format, includeMap }) => ({
        url: `routes/${routeId}/export`,
        method: 'POST',
        body: { format, includeMap },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetRoutesQuery,
  useGetRouteQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useOptimizeRouteMutation,
  useGetOptimizationStatusQuery,
  useUpdateRouteSequenceMutation,
  useAddOutletsToRouteMutation,
  useRemoveOutletsFromRouteMutation,
  useGetRoutesByTerritoryQuery,
  useDuplicateRouteMutation,
  useExportRouteMutation,
} = routesApi;
