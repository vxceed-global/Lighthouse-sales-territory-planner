
import { Outlet } from './outlet.types';

export interface Route {
  id: string;
  name: string;
  outlets: string[]; // Array of outlet IDs
  territory: string;
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  totalDistance: number; // in kilometers
  totalDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface RouteWithDetails extends Route {
  outletDetails: Outlet[];
  waypoints: {
    location: {
      lat: number;
      lng: number;
    };
    stopover: boolean;
  }[];
}

export interface OptimizationParams {
  territoryId?: string;
  outletIds?: string[];
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  maxOutlets?: number;
  prioritizeTier?: boolean;
  prioritizeNppd?: boolean;
}

