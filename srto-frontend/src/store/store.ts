
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { srtoApi } from './api/srtoApi';
import outletsReducer from './slices/outletsSlice';
import routesReducer from './slices/routesSlice';
import territoriesReducer from './slices/territoriesSlice';
import optimizationReducer from './slices/optimizationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    outlets: outletsReducer,
    routes: routesReducer,
    territories: territoriesReducer,
    optimization: optimizationReducer,
    ui: uiReducer,
    [srtoApi.reducerPath]: srtoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(srtoApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

