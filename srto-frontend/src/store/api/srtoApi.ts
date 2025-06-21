
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API
export const srtoApi = createApi({
  reducerPath: 'srtoApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  }),
  tagTypes: ['Outlets', 'Routes', 'Territories', 'Optimization'],
  endpoints: () => ({}),
});

// We'll extend this API with specific endpoints in separate files

