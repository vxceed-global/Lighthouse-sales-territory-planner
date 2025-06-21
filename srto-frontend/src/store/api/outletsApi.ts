import { srtoApi } from './srtoApi';
import type { 
  Outlet, 
  OutletFilters, 
  ApiResponse, 
  PaginatedResponse, 
  BulkOperationResponse,
  ImportSession,
  ImportRequest
} from '../../types';

// Extend the base API with outlets endpoints
export const outletsApi = srtoApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated outlets with filtering
    getOutlets: builder.query<PaginatedResponse<Outlet>, {
      page?: number;
      limit?: number;
      filters?: OutletFilters;
      territoryId?: string;
    }>({
      query: ({ page = 1, limit = 50, filters, territoryId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (territoryId) params.append('territoryId', territoryId);
        if (filters?.channel?.length) {
          filters.channel.forEach(c => params.append('channel', c));
        }
        if (filters?.tier?.length) {
          filters.tier.forEach(t => params.append('tier', t));
        }
        if (filters?.territory?.length) {
          filters.territory.forEach(t => params.append('territory', t));
        }
        if (filters?.searchTerm) {
          params.append('search', filters.searchTerm);
        }

        return `outlets?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Outlets' as const, id })),
              { type: 'Outlets', id: 'LIST' },
            ]
          : [{ type: 'Outlets', id: 'LIST' }],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get single outlet by ID
    getOutlet: builder.query<ApiResponse<Outlet>, string>({
      query: (id) => `outlets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Outlets', id }],
    }),

    // Create new outlet
    createOutlet: builder.mutation<ApiResponse<Outlet>, Partial<Outlet>>({
      query: (outlet) => ({
        url: 'outlets',
        method: 'POST',
        body: outlet,
      }),
      invalidatesTags: [{ type: 'Outlets', id: 'LIST' }],
      // Optimistic update
      onQueryStarted: async (outlet, { dispatch, queryFulfilled }) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticOutlet = { 
          ...outlet, 
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Outlet;

        // Optimistically add to cache
        const patchResult = dispatch(
          outletsApi.util.updateQueryData('getOutlets', { page: 1, limit: 50 }, (draft) => {
            draft.data.unshift(optimisticOutlet);
            draft.pagination.total += 1;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on failure
          patchResult.undo();
        }
      },
    }),

    // Update existing outlet
    updateOutlet: builder.mutation<ApiResponse<Outlet>, { id: string; outlet: Partial<Outlet> }>({
      query: ({ id, outlet }) => ({
        url: `outlets/${id}`,
        method: 'PUT',
        body: outlet,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Outlets', id },
        { type: 'Outlets', id: 'LIST' },
      ],
      // Optimistic update
      onQueryStarted: async ({ id, outlet }, { dispatch, queryFulfilled }) => {
        const patchResults: any[] = [];

        // Update all relevant cache entries
        dispatch(
          outletsApi.util.updateQueryData('getOutlet', id, (draft) => {
            Object.assign(draft.data, outlet, { updatedAt: new Date().toISOString() });
            patchResults.push(() => draft);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert all optimistic updates on failure
          patchResults.forEach(revert => revert());
        }
      },
    }),

    // Delete outlet
    deleteOutlet: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `outlets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Outlets', id },
        { type: 'Outlets', id: 'LIST' },
      ],
    }),

    // Bulk operations
    bulkCreateOutlets: builder.mutation<BulkOperationResponse, Outlet[]>({
      query: (outlets) => ({
        url: 'outlets/bulk',
        method: 'POST',
        body: { outlets },
      }),
      invalidatesTags: [{ type: 'Outlets', id: 'LIST' }],
    }),

    bulkUpdateOutlets: builder.mutation<BulkOperationResponse, Array<{ id: string; outlet: Partial<Outlet> }>>({
      query: (updates) => ({
        url: 'outlets/bulk',
        method: 'PUT',
        body: { updates },
      }),
      invalidatesTags: [{ type: 'Outlets', id: 'LIST' }],
    }),

    bulkDeleteOutlets: builder.mutation<BulkOperationResponse, string[]>({
      query: (ids) => ({
        url: 'outlets/bulk',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Outlets', id: 'LIST' }],
    }),

    // Import operations
    importOutlets: builder.mutation<ApiResponse<ImportSession>, ImportRequest>({
      query: (importRequest) => {
        const formData = new FormData();
        formData.append('file', importRequest.file);
        formData.append('type', importRequest.type);
        formData.append('options', JSON.stringify(importRequest.options));

        return {
          url: 'outlets/import',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Outlets', id: 'LIST' }],
    }),

    // Get import session status
    getImportSession: builder.query<ApiResponse<ImportSession>, string>({
      query: (sessionId) => `outlets/import/${sessionId}`,
      // Poll every 2 seconds for active imports
      pollingInterval: (args, { getState }) => {
        const session = (getState() as any).srtoApi.queries[`getImportSession(${JSON.stringify(args)})`]?.data?.data;
        return session?.status === 'processing' ? 2000 : 0;
      },
    }),

    // Territory assignment
    assignOutletsToTerritory: builder.mutation<ApiResponse<void>, {
      outletIds: string[];
      territoryId: string;
      reason?: string;
    }>({
      query: ({ outletIds, territoryId, reason }) => ({
        url: 'outlets/assign-territory',
        method: 'POST',
        body: { outletIds, territoryId, reason },
      }),
      invalidatesTags: [
        { type: 'Outlets', id: 'LIST' },
        { type: 'Territories', id: 'LIST' },
      ],
    }),

    // Get outlets by territory
    getOutletsByTerritory: builder.query<ApiResponse<Outlet[]>, string>({
      query: (territoryId) => `outlets/territory/${territoryId}`,
      providesTags: (result, _error, territoryId) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Outlets' as const, id })),
              { type: 'Outlets', id: `TERRITORY_${territoryId}` },
            ]
          : [{ type: 'Outlets', id: `TERRITORY_${territoryId}` }],
    }),

    // Validate outlet coordinates
    validateOutletCoordinates: builder.mutation<ApiResponse<{
      valid: boolean;
      suggestions?: Array<{ lat: number; lng: number; address: string; confidence: number }>;
    }>, { address: string; currentCoordinates?: { lat: number; lng: number } }>({
      query: (data) => ({
        url: 'outlets/validate-coordinates',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetOutletsQuery,
  useGetOutletQuery,
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
  useBulkCreateOutletsMutation,
  useBulkUpdateOutletsMutation,
  useBulkDeleteOutletsMutation,
  useImportOutletsMutation,
  useGetImportSessionQuery,
  useAssignOutletsToTerritoryMutation,
  useGetOutletsByTerritoryQuery,
  useValidateOutletCoordinatesMutation,
} = outletsApi;
