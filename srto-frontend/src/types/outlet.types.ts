
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

export interface OutletFilters {
  channel?: string[];
  tier?: string[];
  territory?: string[];
  searchTerm?: string;
}

