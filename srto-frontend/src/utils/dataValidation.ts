import type { Outlet, Route, Territory } from '../types';

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Outlet validation
export const validateOutlet = (outlet: Partial<Outlet>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!outlet.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Outlet name is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!outlet.address?.trim()) {
    errors.push({
      field: 'address',
      message: 'Outlet address is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!outlet.location?.lat || !outlet.location?.lng) {
    errors.push({
      field: 'location',
      message: 'Valid coordinates are required',
      code: 'INVALID_COORDINATES'
    });
  } else {
    // Validate coordinate ranges
    if (outlet.location.lat < -90 || outlet.location.lat > 90) {
      errors.push({
        field: 'location.lat',
        message: 'Latitude must be between -90 and 90',
        code: 'INVALID_LATITUDE'
      });
    }
    if (outlet.location.lng < -180 || outlet.location.lng > 180) {
      errors.push({
        field: 'location.lng',
        message: 'Longitude must be between -180 and 180',
        code: 'INVALID_LONGITUDE'
      });
    }
  }

  if (!outlet.channel) {
    errors.push({
      field: 'channel',
      message: 'Channel is required',
      code: 'REQUIRED_FIELD'
    });
  } else if (!['supermarket', 'convenience', 'horeca', 'traditional'].includes(outlet.channel)) {
    errors.push({
      field: 'channel',
      message: 'Invalid channel type',
      code: 'INVALID_ENUM'
    });
  }

  if (!outlet.tier) {
    errors.push({
      field: 'tier',
      message: 'Tier is required',
      code: 'REQUIRED_FIELD'
    });
  } else if (!['gold', 'silver', 'bronze'].includes(outlet.tier)) {
    errors.push({
      field: 'tier',
      message: 'Invalid tier type',
      code: 'INVALID_ENUM'
    });
  }

  if (outlet.serviceTime !== undefined && outlet.serviceTime < 0) {
    errors.push({
      field: 'serviceTime',
      message: 'Service time cannot be negative',
      code: 'INVALID_VALUE'
    });
  }

  // Warnings
  if (outlet.salesVolume !== undefined && outlet.salesVolume <= 0) {
    warnings.push({
      field: 'salesVolume',
      message: 'Sales volume should be greater than 0',
      code: 'LOW_SALES_VOLUME'
    });
  }

  if (outlet.nppdScore !== undefined && (outlet.nppdScore < 0 || outlet.nppdScore > 100)) {
    warnings.push({
      field: 'nppdScore',
      message: 'NPPD score should be between 0 and 100',
      code: 'INVALID_NPPD_SCORE'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Route validation
export const validateRoute = (route: Partial<Route>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!route.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Route name is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!route.territory?.trim()) {
    errors.push({
      field: 'territory',
      message: 'Territory is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!route.startLocation) {
    errors.push({
      field: 'startLocation',
      message: 'Start location is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!route.endLocation) {
    errors.push({
      field: 'endLocation',
      message: 'End location is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (route.outlets && route.outlets.length === 0) {
    warnings.push({
      field: 'outlets',
      message: 'Route has no outlets assigned',
      code: 'EMPTY_ROUTE'
    });
  }

  if (route.outlets && route.outlets.length > 50) {
    warnings.push({
      field: 'outlets',
      message: 'Route has many outlets, consider splitting',
      code: 'LARGE_ROUTE'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Territory validation
export const validateTerritory = (territory: Partial<Territory>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!territory.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Territory name is required',
      code: 'REQUIRED_FIELD'
    });
  }

  if (territory.boundaries && territory.boundaries.length < 3) {
    errors.push({
      field: 'boundaries',
      message: 'Territory must have at least 3 boundary points',
      code: 'INSUFFICIENT_BOUNDARIES'
    });
  }

  if (territory.outletCount !== undefined && territory.outletCount > 10000) {
    warnings.push({
      field: 'outletCount',
      message: 'Territory has very large number of outlets',
      code: 'LARGE_TERRITORY'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Data transformation utilities
export const transformOutletFromAPI = (apiOutlet: any): Outlet => {
  return {
    id: apiOutlet.id || apiOutlet.outlet_id,
    name: apiOutlet.name || apiOutlet.outlet_name,
    address: apiOutlet.address || apiOutlet.full_address,
    location: {
      lat: parseFloat(apiOutlet.latitude || apiOutlet.lat),
      lng: parseFloat(apiOutlet.longitude || apiOutlet.lng),
    },
    channel: apiOutlet.channel || apiOutlet.outlet_type,
    tier: apiOutlet.tier || apiOutlet.outlet_tier,
    salesVolume: apiOutlet.sales_volume ? parseFloat(apiOutlet.sales_volume) : undefined,
    nppdScore: apiOutlet.nppd_score ? parseFloat(apiOutlet.nppd_score) : undefined,
    serviceTime: parseInt(apiOutlet.service_time || '15'),
    lastVisit: apiOutlet.last_visit || apiOutlet.last_visit_date,
    assignedTerritory: apiOutlet.territory_id || apiOutlet.assigned_territory,
    assignedRoute: apiOutlet.route_id || apiOutlet.assigned_route,
  };
};

export const transformRouteFromAPI = (apiRoute: any): Route => {
  return {
    id: apiRoute.id || apiRoute.route_id,
    name: apiRoute.name || apiRoute.route_name,
    outlets: apiRoute.outlets || apiRoute.outlet_ids || [],
    territory: apiRoute.territory || apiRoute.territory_id,
    startLocation: {
      lat: parseFloat(apiRoute.start_lat || apiRoute.start_location?.lat),
      lng: parseFloat(apiRoute.start_lng || apiRoute.start_location?.lng),
      address: apiRoute.start_address || apiRoute.start_location?.address,
    },
    endLocation: {
      lat: parseFloat(apiRoute.end_lat || apiRoute.end_location?.lat),
      lng: parseFloat(apiRoute.end_lng || apiRoute.end_location?.lng),
      address: apiRoute.end_address || apiRoute.end_location?.address,
    },
    totalDistance: parseFloat(apiRoute.total_distance || '0'),
    totalDuration: parseInt(apiRoute.total_duration || '0'),
    createdAt: apiRoute.created_at || apiRoute.createdAt || new Date().toISOString(),
    updatedAt: apiRoute.updated_at || apiRoute.updatedAt || new Date().toISOString(),
  };
};

export const transformTerritoryFromAPI = (apiTerritory: any): Territory => {
  return {
    id: apiTerritory.id || apiTerritory.territory_id,
    name: apiTerritory.name || apiTerritory.territory_name,
    boundaries: apiTerritory.boundaries || apiTerritory.boundary_points || [],
    color: apiTerritory.color || apiTerritory.display_color || '#7C00EF',
    outletCount: parseInt(apiTerritory.outlet_count || '0'),
    salesRep: apiTerritory.sales_rep || apiTerritory.assigned_sales_rep,
    createdAt: apiTerritory.created_at || apiTerritory.createdAt || new Date().toISOString(),
    updatedAt: apiTerritory.updated_at || apiTerritory.updatedAt || new Date().toISOString(),
  };
};

// Batch validation
export const validateOutletBatch = (outlets: Partial<Outlet>[]): {
  validOutlets: Outlet[];
  invalidOutlets: Array<{ outlet: Partial<Outlet>; validation: ValidationResult; index: number }>;
} => {
  const validOutlets: Outlet[] = [];
  const invalidOutlets: Array<{ outlet: Partial<Outlet>; validation: ValidationResult; index: number }> = [];

  outlets.forEach((outlet, index) => {
    const validation = validateOutlet(outlet);
    if (validation.isValid) {
      validOutlets.push(outlet as Outlet);
    } else {
      invalidOutlets.push({ outlet, validation, index });
    }
  });

  return { validOutlets, invalidOutlets };
};

// Coordinate validation utilities
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

export const sanitizeCoordinates = (lat: any, lng: any): { lat: number; lng: number } | null => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  
  if (isValidCoordinate(parsedLat, parsedLng)) {
    return { lat: parsedLat, lng: parsedLng };
  }
  
  return null;
};
