
import { Route } from './route.types';

export interface OptimizationResult {
  route: Route;
  metrics: {
    totalOutlets: number;
    totalDistance: number;
    totalDuration: number;
    averageServiceTime: number;
    fuelConsumption: number;
    co2Emissions: number;
  };
  status: 'success' | 'partial' | 'failed';
  message?: string;
}

export interface OptimizationHistory {
  id: string;
  params: any;
  result: OptimizationResult;
  createdAt: string;
  savedRoute?: string; // ID of saved route if any
}

