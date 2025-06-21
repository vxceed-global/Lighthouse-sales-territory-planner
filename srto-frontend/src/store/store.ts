
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { srtoApi } from './api/srtoApi';
import authReducer from './slices/authSlice';
import outletsReducer from './slices/outletsSlice';
import routesReducer from './slices/routesSlice';
import territoriesReducer from './slices/territoriesSlice';
import optimizationReducer from './slices/optimizationSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    outlets: outletsReducer,
    routes: routesReducer,
    territories: territoriesReducer,
    optimization: optimizationReducer,
    ui: uiReducer,
    [srtoApi.reducerPath]: srtoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(srtoApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

