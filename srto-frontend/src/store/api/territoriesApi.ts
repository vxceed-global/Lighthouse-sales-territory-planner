import { srtoApi } from './srtoApi';
import type { 
  Territory, 
  TerritoryAssignment,
  ApiResponse, 
  PaginatedResponse,
  PlanningSession,
  Location
} from '../../types';

// Territory-specific types
export interface TerritoryBoundary {
  id: string;
  territoryId: string;
  coordinates: Array<{ lat: number; lng: number }>;
  type: 'polygon' | 'circle' | 'rectangle';
  metadata?: {
    area: number; // in square kilometers
    perimeter: number; // in kilometers
    center: { lat: number; lng: number };
  };
}

export interface TerritoryAnalytics {
  territoryId: string;
  metrics: {
    totalOutlets: number;
    outletsByChannel: Record<string, number>;
    outletsByTier: Record<string, number>;
    totalSalesVolume: number;
    averageNPPDScore: number;
    coverage: {
      area: number; // square kilometers
      density: number; // outlets per sq km
    };
    routes: {
      total: number;
      averageDistance: number;
      averageTime: number;
      efficiency: number;
    };
  };
  trends: {
    period: string;
    salesGrowth: number;
    outletGrowth: number;
    efficiencyChange: number;
  };
}

export interface TerritorySnapshot {
  id: string;
  territoryId: string;
  version: string;
  createdAt: string;
  data: {
    outlets: any[];
    routes: any[];
    boundaries: TerritoryBoundary[];
    analytics: TerritoryAnalytics;
  };
  compressed: boolean;
  size: number; // in bytes
}

// Extend the base API with territories endpoints
export const territoriesApi = srtoApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated territories
    getTerritories: builder.query<PaginatedResponse<Territory>, {
      page?: number;
      limit?: number;
      distributorId?: string;
      channel?: string;
      search?: string;
    }>({
      query: ({ page = 1, limit = 50, distributorId, channel, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (distributorId) params.append('distributorId', distributorId);
        if (channel) params.append('channel', channel);
        if (search) params.append('search', search);

        return `territories?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Territories' as const, id })),
              { type: 'Territories', id: 'LIST' },
            ]
          : [{ type: 'Territories', id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),

    // Get single territory
    getTerritory: builder.query<ApiResponse<Territory>, string>({
      query: (id) => `territories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Territories', id }],
    }),

    // Create new territory
    createTerritory: builder.mutation<ApiResponse<Territory>, Partial<Territory>>({
      query: (territory) => ({
        url: 'territories',
        method: 'POST',
        body: territory,
      }),
      invalidatesTags: [{ type: 'Territories', id: 'LIST' }],
    }),

    // Update existing territory
    updateTerritory: builder.mutation<ApiResponse<Territory>, { id: string; territory: Partial<Territory> }>({
      query: ({ id, territory }) => ({
        url: `territories/${id}`,
        method: 'PUT',
        body: territory,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Territories', id },
        { type: 'Territories', id: 'LIST' },
      ],
    }),

    // Delete territory
    deleteTerritory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `territories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Territories', id },
        { type: 'Territories', id: 'LIST' },
      ],
    }),

    // Territory boundary management
    getTerritoryBoundaries: builder.query<ApiResponse<TerritoryBoundary[]>, string>({
      query: (territoryId) => `territories/${territoryId}/boundaries`,
      providesTags: (_result, _error, territoryId) => [
        { type: 'Territories', id: `BOUNDARIES_${territoryId}` }
      ],
    }),

    updateTerritoryBoundaries: builder.mutation<ApiResponse<TerritoryBoundary[]>, {
      territoryId: string;
      boundaries: Array<{
        coordinates: Array<{ lat: number; lng: number }>;
        type: 'polygon' | 'circle' | 'rectangle';
      }>;
    }>({
      query: ({ territoryId, boundaries }) => ({
        url: `territories/${territoryId}/boundaries`,
        method: 'PUT',
        body: { boundaries },
      }),
      invalidatesTags: (_result, _error, { territoryId }) => [
        { type: 'Territories', id: territoryId },
        { type: 'Territories', id: `BOUNDARIES_${territoryId}` },
      ],
    }),

    // Territory analytics
    getTerritoryAnalytics: builder.query<ApiResponse<TerritoryAnalytics>, {
      territoryId: string;
      period?: string; // 'week' | 'month' | 'quarter' | 'year'
    }>({
      query: ({ territoryId, period = 'month' }) => 
        `territories/${territoryId}/analytics?period=${period}`,
      providesTags: (_result, _error, { territoryId }) => [
        { type: 'Territories', id: `ANALYTICS_${territoryId}` }
      ],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),

    // Territory snapshot management
    createTerritorySnapshot: builder.mutation<ApiResponse<TerritorySnapshot>, {
      territoryId: string;
      version?: string;
      compress?: boolean;
    }>({
      query: ({ territoryId, version, compress = true }) => ({
        url: `territories/${territoryId}/snapshots`,
        method: 'POST',
        body: { version, compress },
      }),
      invalidatesTags: (_result, _error, { territoryId }) => [
        { type: 'Territories', id: `SNAPSHOTS_${territoryId}` }
      ],
    }),

    getTerritorySnapshots: builder.query<ApiResponse<TerritorySnapshot[]>, string>({
      query: (territoryId) => `territories/${territoryId}/snapshots`,
      providesTags: (_result, _error, territoryId) => [
        { type: 'Territories', id: `SNAPSHOTS_${territoryId}` }
      ],
    }),

    loadTerritorySnapshot: builder.query<ApiResponse<TerritorySnapshot>, {
      territoryId: string;
      snapshotId: string;
    }>({
      query: ({ territoryId, snapshotId }) => 
        `territories/${territoryId}/snapshots/${snapshotId}`,
      // Don't cache snapshot data as it's large
      keepUnusedDataFor: 0,
    }),

    // Planning session management
    createPlanningSession: builder.mutation<ApiResponse<PlanningSession>, {
      territoryId: string;
      channel: 'GT' | 'MT';
      lockDuration?: number; // in minutes, default 60
    }>({
      query: ({ territoryId, channel, lockDuration = 60 }) => ({
        url: 'territories/planning-sessions',
        method: 'POST',
        body: { territoryId, channel, lockDuration },
      }),
      invalidatesTags: [{ type: 'Territories', id: 'SESSIONS' }],
    }),

    getPlanningSession: builder.query<ApiResponse<PlanningSession>, string>({
      query: (sessionId) => `territories/planning-sessions/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [
        { type: 'Territories', id: `SESSION_${sessionId}` }
      ],
      // Poll every 30 seconds to check session status
      pollingInterval: 30000,
    }),

    extendPlanningSession: builder.mutation<ApiResponse<PlanningSession>, {
      sessionId: string;
      additionalMinutes: number;
    }>({
      query: ({ sessionId, additionalMinutes }) => ({
        url: `territories/planning-sessions/${sessionId}/extend`,
        method: 'POST',
        body: { additionalMinutes },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: 'Territories', id: `SESSION_${sessionId}` }
      ],
    }),

    closePlanningSession: builder.mutation<ApiResponse<void>, {
      sessionId: string;
      commitChanges: boolean;
    }>({
      query: ({ sessionId, commitChanges }) => ({
        url: `territories/planning-sessions/${sessionId}/close`,
        method: 'POST',
        body: { commitChanges },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: 'Territories', id: `SESSION_${sessionId}` },
        { type: 'Territories', id: 'SESSIONS' },
        { type: 'Territories', id: 'LIST' },
      ],
    }),

    // Territory validation and recommendations
    validateTerritorySize: builder.query<ApiResponse<{
      isValid: boolean;
      metrics: {
        outletCount: number;
        estimatedArea: number;
        recommendedSplit?: {
          suggestedBoundaries: Array<Array<{ lat: number; lng: number }>>;
          reasoning: string;
        };
      };
      warnings: string[];
    }>, string>({
      query: (territoryId) => `territories/${territoryId}/validate`,
    }),

    // Auto-assign outlets to territories
    autoAssignOutlets: builder.mutation<ApiResponse<{
      assigned: number;
      unassigned: string[];
      conflicts: Array<{
        outletId: string;
        possibleTerritories: string[];
      }>;
    }>, {
      territoryIds?: string[];
      outletIds?: string[];
      strategy: 'nearest' | 'balanced' | 'sales_volume';
    }>({
      query: ({ territoryIds, outletIds, strategy }) => ({
        url: 'territories/auto-assign',
        method: 'POST',
        body: { territoryIds, outletIds, strategy },
      }),
      invalidatesTags: [
        { type: 'Territories', id: 'LIST' },
        { type: 'Outlets', id: 'LIST' },
      ],
    }),

    // Territory comparison
    compareTerritories: builder.query<ApiResponse<{
      territories: Array<{
        id: string;
        name: string;
        metrics: TerritoryAnalytics['metrics'];
      }>;
      comparison: {
        bestPerforming: string;
        recommendations: string[];
      };
    }>, string[]>({
      query: (territoryIds) => ({
        url: 'territories/compare',
        method: 'POST',
        body: { territoryIds },
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetTerritoriesQuery,
  useGetTerritoryQuery,
  useCreateTerritoryMutation,
  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
  useGetTerritoryBoundariesQuery,
  useUpdateTerritoryBoundariesMutation,
  useGetTerritoryAnalyticsQuery,
  useCreateTerritorySnapshotMutation,
  useGetTerritorySnapshotsQuery,
  useLoadTerritorySnapshotQuery,
  useCreatePlanningSessionMutation,
  useGetPlanningSessionQuery,
  useExtendPlanningSessionMutation,
  useClosePlanningSessionMutation,
  useValidateTerritorySizeQuery,
  useAutoAssignOutletsMutation,
  useCompareTerritoriesQuery,
} = territoriesApi;
