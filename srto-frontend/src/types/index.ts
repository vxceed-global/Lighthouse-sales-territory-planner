export * from './outlet.types';
export * from './route.types';
export * from './territory.types';
export * from './optimization.types';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

// Import/Export Types
export interface ImportSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'outlets' | 'routes' | 'territories';
  fileName: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors?: string[];
  createdAt: string;
  completedAt?: string;
}

export interface ImportRequest {
  file: File;
  type: 'outlets' | 'routes' | 'territories';
  options: {
    skipDuplicates: boolean;
    updateExisting: boolean;
    validateCoordinates: boolean;
  };
}

// Session Management Types
export interface PlanningSession {
  id: string;
  territoryId: string;
  userId: string;
  status: 'active' | 'locked' | 'completed';
  channel: 'GT' | 'MT';
  changes: PlanningChange[];
  createdAt: string;
  lastModified: string;
  lockedUntil?: string;
}

export interface PlanningChange {
  id: string;
  type: 'outlet_assignment' | 'route_modification' | 'territory_boundary';
  entityId: string;
  oldValue: any;
  newValue: any;
  reason?: string;
  timestamp: string;
}

// Common utility types
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}