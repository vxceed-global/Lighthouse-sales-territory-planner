import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import AppLayout from '@components/common/Layout/AppLayout';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@pages/Dashboard'));
const OutletsPage = lazy(() => import('@pages/Outlets'));
const RoutesPage = lazy(() => import('@pages/Routes'));
const MapPage = lazy(() => import('@pages/Map'));
const TerritoriesPage = lazy(() => import('@pages/Territories'));
const ReportsPage = lazy(() => import('@pages/Reports'));

function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="loading-container"><Spin size="large" /></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/outlets" element={<OutletsPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/territories" element={<TerritoriesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;
