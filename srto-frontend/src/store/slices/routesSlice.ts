import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Route, RouteWithDetails } from '../../types/route.types';

interface RoutesState {
  routes: Route[];
  selectedRoute: RouteWithDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoutesState = {
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload);
    },
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex((route: Route) => route.id === action.payload.id);
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    },
    removeRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter((route: Route) => route.id !== action.payload);
    },
    selectRoute: (state, action: PayloadAction<RouteWithDetails>) => {
      state.selectedRoute = action.payload;
    },
    clearSelectedRoute: (state) => {
      state.selectedRoute = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRoutes,
  addRoute,
  updateRoute,
  removeRoute,
  selectRoute,
  clearSelectedRoute,
  setLoading,
  setError,
} = routesSlice.actions;

export default routesSlice.reducer;