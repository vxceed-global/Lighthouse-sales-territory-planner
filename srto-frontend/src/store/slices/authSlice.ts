import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'planner' | 'dt_user' | 'analyst';
  permissions: string[];
  territories: string[]; // Territory IDs user has access to
  distributorId?: string; // For DT users
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sessionExpiry: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('srto_token'),
  refreshToken: localStorage.getItem('srto_refresh_token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionExpiry: localStorage.getItem('srto_session_expiry'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      token: string;
      refreshToken: string;
      expiresAt: string;
    }>) => {
      const { user, token, refreshToken, expiresAt } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.sessionExpiry = expiresAt;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem('srto_token', token);
      localStorage.setItem('srto_refresh_token', refreshToken);
      localStorage.setItem('srto_session_expiry', expiresAt);
      localStorage.setItem('srto_user', JSON.stringify(user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.sessionExpiry = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('srto_token');
      localStorage.removeItem('srto_refresh_token');
      localStorage.removeItem('srto_session_expiry');
      localStorage.removeItem('srto_user');
    },
    refreshTokenSuccess: (state, action: PayloadAction<{
      token: string;
      expiresAt: string;
    }>) => {
      const { token, expiresAt } = action.payload;
      state.token = token;
      state.sessionExpiry = expiresAt;
      
      // Update localStorage
      localStorage.setItem('srto_token', token);
      localStorage.setItem('srto_session_expiry', expiresAt);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('srto_user', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Initialize auth state from localStorage on app start
    initializeAuth: (state) => {
      const storedUser = localStorage.getItem('srto_user');
      const storedToken = localStorage.getItem('srto_token');
      const storedExpiry = localStorage.getItem('srto_session_expiry');
      
      if (storedUser && storedToken && storedExpiry) {
        const expiryDate = new Date(storedExpiry);
        const now = new Date();
        
        // Check if token is still valid
        if (expiryDate > now) {
          state.user = JSON.parse(storedUser);
          state.token = storedToken;
          state.sessionExpiry = storedExpiry;
          state.isAuthenticated = true;
        } else {
          // Token expired, clear everything
          authSlice.caseReducers.logout(state);
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
  updateUser,
  clearError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.user?.permissions || [];
export const selectUserTerritories = (state: { auth: AuthState }) => state.auth.user?.territories || [];
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

// Permission checking helper
export const hasPermission = (state: { auth: AuthState }, permission: string): boolean => {
  return state.auth.user?.permissions.includes(permission) || false;
};

// Territory access checking helper
export const hasAccessToTerritory = (state: { auth: AuthState }, territoryId: string): boolean => {
  const user = state.auth.user;
  if (!user) return false;
  
  // Admins have access to all territories
  if (user.role === 'admin') return true;
  
  // Check if user has explicit access to this territory
  return user.territories.includes(territoryId);
};
