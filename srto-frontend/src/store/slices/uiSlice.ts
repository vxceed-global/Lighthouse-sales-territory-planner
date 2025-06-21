
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  loading: {
    outlets: boolean;
    routes: boolean;
    territories: boolean;
    optimization: boolean;
  };
}

const initialState: UiState = {
  sidebarCollapsed: false,
  darkMode: false,
  loading: {
    outlets: false,
    routes: false,
    territories: false,
    optimization: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Apply dark mode to document
      if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    setLoading: (state, action: PayloadAction<{ key: keyof UiState['loading']; value: boolean }>) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const { toggleSidebar, toggleDarkMode, setLoading } = uiSlice.actions;
export default uiSlice.reducer;

