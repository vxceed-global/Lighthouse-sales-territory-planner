# SRTO Frontend Project Setup & Structure

## 1. Initialize Project

```bash
# Create new Vite project with React and TypeScript
npm create vite@latest srto-frontend -- --template react-ts

# Navigate to project
cd srto-frontend

# Install core dependencies
npm install react react-dom
npm install -D @types/react @types/react-dom

# Install Ant Design and icons
npm install antd @ant-design/icons

# Install Redux Toolkit
npm install @reduxjs/toolkit react-redux

# Install Google Maps
npm install @googlemaps/js-api-loader @react-google-maps/api
npm install -D @types/google.maps

# Install routing
npm install react-router-dom
npm install -D @types/react-router-dom

# Install utilities
npm install dayjs lodash-es recharts
npm install -D @types/lodash-es

# Install development tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

## 2. Project Folder Structure

```
srto-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Map/
│   │   │   │   ├── GoogleMap.tsx
│   │   │   │   ├── MapControls.tsx
│   │   │   │   └── index.ts
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── TableActions.tsx
│   │   │   │   └── index.ts
│   │   │   ├── LoadingStates/
│   │   │   │   ├── MapSkeleton.tsx
│   │   │   │   ├── TableSkeleton.tsx
│   │   │   │   └── index.ts
│   │   │   └── Layout/
│   │   │       ├── AppLayout.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── index.ts
│   │   ├── outlets/
│   │   │   ├── OutletList/
│   │   │   │   ├── OutletList.tsx
│   │   │   │   ├── OutletFilters.tsx
│   │   │   │   └── index.ts
│   │   │   ├── OutletMap/
│   │   │   │   ├── OutletMap.tsx
│   │   │   │   ├── OutletMarker.tsx
│   │   │   │   └── index.ts
│   │   │   └── OutletDetails/
│   │   │       ├── OutletDetails.tsx
│   │   │       └── index.ts
│   │   ├── routes/
│   │   │   ├── RouteOptimizer/
│   │   │   │   ├── RouteOptimizer.tsx
│   │   │   │   ├── OptimizationControls.tsx
│   │   │   │   └── index.ts
│   │   │   ├── RouteTimeline/
│   │   │   │   ├── RouteTimeline.tsx
│   │   │   │   └── index.ts
│   │   │   └── RouteMap/
│   │   │       ├── RouteMap.tsx
│   │   │       ├── RoutePolyline.tsx
│   │   │       └── index.ts
│   │   └── territories/
│   │       ├── TerritoryBoundaries/
│   │       │   ├── TerritoryBoundaries.tsx
│   │       │   └── index.ts
│   │       └── TerritoryAssignment/
│   │           ├── TerritoryAssignment.tsx
│   │           ├── AssignmentModal.tsx
│   │           └── index.ts
│   ├── features/
│   │   ├── optimization/
│   │   │   ├── OptimizationDashboard.tsx
│   │   │   └── index.ts
│   │   ├── reporting/
│   │   │   ├── ReportingDashboard.tsx
│   │   │   └── index.ts
│   │   └── settings/
│   │       ├── SettingsPage.tsx
│   │       └── index.ts
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── index.ts
│   │   ├── Outlets/
│   │   │   ├── OutletsPage.tsx
│   │   │   └── index.ts
│   │   ├── Routes/
│   │   │   ├── RoutesPage.tsx
│   │   │   └── index.ts
│   │   ├── Territories/
│   │   │   ├── TerritoriesPage.tsx
│   │   │   └── index.ts
│   │   └── Reports/
│   │       ├── ReportsPage.tsx
│   │       └── index.ts
│   ├── services/
│   │   ├── googleMaps/
│   │   │   ├── googleMapsLoader.ts
│   │   │   ├── mapStyles.ts
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── index.ts
│   │   └── export/
│   │       ├── exportService.ts
│   │       └── index.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── outletsSlice.ts
│   │   │   ├── routesSlice.ts
│   │   │   ├── territoriesSlice.ts
│   │   │   ├── optimizationSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── api/
│   │   │   └── srtoApi.ts
│   │   ├── store.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useGoogleMaps.ts
│   │   ├── useOptimization.ts
│   │   ├── useDataExport.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── geoCalculations.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── outlet.types.ts
│   │   ├── route.types.ts
│   │   ├── territory.types.ts
│   │   ├── optimization.types.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── antd-overrides.css
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── index.css
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── package.json
└── README.md
```

## 3. Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    }
  },
  optimizeDeps: {
    include: ['@googlemaps/js-api-loader', 'antd']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'google-maps': ['@googlemaps/js-api-loader', '@react-google-maps/api'],
          'vendor-ui': ['antd', '@ant-design/icons'],
          'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-charts': ['recharts'],
        }
      }
    }
  }
})
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["google.maps"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@pages/*": ["src/pages/*"],
      "@services/*": ["src/services/*"],
      "@store/*": ["src/store/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### .env.example
```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_NPPD=true
VITE_ENABLE_DARK_MODE=false

# Map Configuration
VITE_DEFAULT_MAP_CENTER_LAT=12.9716
VITE_DEFAULT_MAP_CENTER_LNG=77.5946
VITE_DEFAULT_MAP_ZOOM=12
```

### .eslintrc.json
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 4. Key Initial Files

### src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from '@store';
import '@styles/index.css';

const theme = {
  token: {
    colorPrimary: '#7C00EF',
    colorPrimaryHover: '#9D2FFF',
    colorPrimaryActive: '#5A00B3',
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorInfo: '#1890FF',
    borderRadius: 8,
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
```

### src/types/index.ts
```typescript
// Outlet Types
export interface Outlet {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  channel: 'supermarket' | 'convenience' | 'horeca' | 'traditional';
  tier: 'gold' | 'silver' | 'bronze';
  salesVolume?: number;
  nppdScore?: number;
  serviceTime: number; // in minutes
  lastVisit?: string;
  assignedTerritory?: string;
  assignedRoute?: string;
}

// Route Types
export interface Route {
  id: string;
  salesPersonId: string;
  salesPersonName: string;
  date: string;
  status: 'draft' | 'optimized' | 'in-progress' | 'completed';
  outlets: string[]; // outlet IDs
  waypoints: Waypoint[];
  totalDistance: number; // in km
  totalTime: number; // in minutes
  startLocation: Location;
  endLocation: Location;
}

export interface Waypoint {
  outletId: string;
  sequence: number;
  estimatedArrival: string;
  estimatedDeparture: string;
  distance: number; // from previous point
  duration: number; // from previous point
}

// Territory Types
export interface Territory {
  id: string;
  name: string;
  distributorId: string;
  boundaries?: google.maps.LatLng[];
  outletCount: number;
  salesPeople: string[];
  totalSalesVolume?: number;
}

// Optimization Types
export interface OptimizationRequest {
  territory: string;
  date: string;
  constraints: {
    maxRouteTime: number;
    maxOutletsPerRoute: number;
    includeNPPD: boolean;
    startTime: string;
    endTime: string;
  };
  manualAssignments?: {
    outletId: string;
    salesPersonId: string;
  }[];
}

export interface OptimizationResult {
  routes: Route[];
  unassignedOutlets: string[];
  totalDistance: number;
  totalTime: number;
  efficiency: number;
}

// Common Types
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
```

## 5. Development Workflow

### Phase 1: Foundation (Current)
1. Set up project structure ✓
2. Configure build tools and linting ✓
3. Create type definitions ✓
4. Next steps:
   - Implement Google Maps integration
   - Create base layout components
   - Set up Redux store
   - Create routing structure

### Phase 2: Core Features
1. Outlet management UI
2. Basic map visualization
3. Territory display
4. Simple route viewing

### Phase 3: Optimization
1. Route optimization controls
2. Manual adjustments interface
3. Real-time optimization feedback
4. NPPD integration

### Phase 4: Analytics & Polish
1. Reporting dashboards
2. Performance optimizations
3. Advanced features
4. Testing and refinement

## 6. Next Immediate Steps

1. **Create the project structure**:
   ```bash
   # Run the setup commands from section 1
   # Create all folders as shown in section 2
   ```

2. **Copy configuration files** from section 3

3. **Create initial components**:
   - AppLayout
   - GoogleMap wrapper
   - Basic routing

4. **Set up state management**:
   - Configure Redux store
   - Create initial slices

5. **Implement Google Maps**:
   - Map loader service
   - Basic map component
   - Marker components

Would you like me to create the specific implementation files for any of these components next?
