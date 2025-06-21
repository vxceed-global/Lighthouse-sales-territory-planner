
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Enhanced base query with authentication and error handling
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  prepareHeaders: (headers, { getState }) => {
    // Add authentication token if available
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Add common headers
    headers.set('Content-Type', 'application/json');
    headers.set('X-Client-Version', import.meta.env.VITE_APP_VERSION || '1.0.0');

    return headers;
  },
});

// Enhanced base query with retry logic and error handling
const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Handle specific error cases
    if (result.error) {
      const { status } = result.error;

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (typeof status === 'number' && status >= 400 && status < 500 && status !== 429) {
        retry.fail(result.error);
      }

      // Handle authentication errors
      if (status === 401) {
        // Dispatch logout action or redirect to login
        // This would be handled by your auth slice
        console.warn('Authentication failed, redirecting to login');
      }
    }

    return result;
  },
  {
    maxRetries: 3,
    retryCondition: (error: any) => {
      // Retry on network errors and 5xx server errors
      return (
        error.status === 'FETCH_ERROR' ||
        error.status === 'TIMEOUT_ERROR' ||
        (typeof error.status === 'number' && error.status >= 500)
      );
    },
  }
);

// Define the base API
export const srtoApi = createApi({
  reducerPath: 'srtoApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    'Outlets',
    'Routes',
    'Territories',
    'Optimization',
    'ImportSessions',
    'PlanningSessions',
    'Analytics'
  ],
  // Global cache settings
  keepUnusedDataFor: 300, // 5 minutes default
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

// We'll extend this API with specific endpoints in separate files

