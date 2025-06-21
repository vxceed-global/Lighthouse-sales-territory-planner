// Caching utilities for large datasets and performance optimization

export interface CacheConfig {
  maxSize: number; // Maximum number of items to cache
  ttl: number; // Time to live in milliseconds
  enableCompression: boolean;
  enablePersistence: boolean; // Store in localStorage/IndexedDB
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  compressed?: boolean;
  size?: number; // Size in bytes
}

export interface CacheStats {
  totalItems: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
}

// LRU Cache implementation for RTK Query
export class LRUCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 5 * 60 * 1000, // 5 minutes
      enableCompression: false,
      enablePersistence: false,
      ...config,
    };
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.stats.hits++;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);

    return item.data;
  }

  set(key: string, data: T): void {
    const now = Date.now();
    const size = this.estimateSize(data);

    // Remove oldest items if cache is full
    while (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      size,
    };

    this.cache.set(key, item);

    // Persist to storage if enabled
    if (this.config.enablePersistence) {
      this.persistItem(key, item);
    }
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted && this.config.enablePersistence) {
      this.removePersistentItem(key);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
    if (this.config.enablePersistence) {
      this.clearPersistentStorage();
    }
  }

  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      totalItems: this.cache.size,
      totalSize: Array.from(this.cache.values()).reduce((sum, item) => sum + (item.size || 0), 0),
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
      evictionCount: this.stats.evictions,
    };
  }

  // Estimate object size in bytes
  private estimateSize(obj: any): number {
    return new Blob([JSON.stringify(obj)]).size;
  }

  // Persistence methods
  private persistItem(key: string, item: CacheItem<T>): void {
    try {
      const storageKey = `srto_cache_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to persist cache item:', error);
    }
  }

  private removePersistentItem(key: string): void {
    try {
      const storageKey = `srto_cache_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to remove persistent cache item:', error);
    }
  }

  private clearPersistentStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('srto_cache_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear persistent cache:', error);
    }
  }
}

// Territory snapshot caching for large datasets
export class TerritorySnapshotCache {
  private cache = new LRUCache<any>({
    maxSize: 10, // Only cache 10 territory snapshots
    ttl: 30 * 60 * 1000, // 30 minutes
    enablePersistence: true,
  });

  async getSnapshot(territoryId: string): Promise<any | null> {
    return this.cache.get(`territory_${territoryId}`);
  }

  async setSnapshot(territoryId: string, snapshot: any): Promise<void> {
    // Compress large snapshots
    const compressedSnapshot = await this.compressSnapshot(snapshot);
    this.cache.set(`territory_${territoryId}`, compressedSnapshot);
  }

  private async compressSnapshot(snapshot: any): Promise<any> {
    // Simple compression by removing unnecessary fields
    return {
      ...snapshot,
      outlets: snapshot.outlets?.map((outlet: any) => ({
        id: outlet.id,
        name: outlet.name,
        location: outlet.location,
        tier: outlet.tier,
        channel: outlet.channel,
        // Remove detailed fields to save space
      })),
    };
  }
}

// RTK Query cache configuration
export const rtkQueryCacheConfig = {
  // Outlets cache - frequently accessed, medium TTL
  outlets: {
    keepUnusedDataFor: 300, // 5 minutes
    refetchOnMountOrArgChange: 30, // Refetch if older than 30 seconds
  },
  
  // Routes cache - less frequently accessed, longer TTL
  routes: {
    keepUnusedDataFor: 600, // 10 minutes
    refetchOnMountOrArgChange: 60, // Refetch if older than 1 minute
  },
  
  // Territories cache - rarely changed, long TTL
  territories: {
    keepUnusedDataFor: 1800, // 30 minutes
    refetchOnMountOrArgChange: 300, // Refetch if older than 5 minutes
  },
  
  // Analytics cache - expensive to compute, very long TTL
  analytics: {
    keepUnusedDataFor: 3600, // 1 hour
    refetchOnMountOrArgChange: 1800, // Refetch if older than 30 minutes
  },
  
  // Import sessions - short TTL for real-time updates
  importSessions: {
    keepUnusedDataFor: 60, // 1 minute
    refetchOnMountOrArgChange: 10, // Refetch if older than 10 seconds
  },
};

// Memory management utilities
export const getMemoryUsage = (): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} => {
  const performance = (window as any).performance;
  if (performance && performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    };
  }
  return {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  };
};

export const isMemoryPressureHigh = (): boolean => {
  const memory = getMemoryUsage();
  if (memory.jsHeapSizeLimit === 0) return false;
  
  const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  return usageRatio > 0.8; // Consider high if using more than 80% of available memory
};

// Viewport-based caching for map data
export class ViewportCache {
  private cache = new Map<string, {
    bounds: google.maps.LatLngBounds;
    data: any[];
    timestamp: number;
  }>();

  private readonly TTL = 2 * 60 * 1000; // 2 minutes

  getBoundsKey(bounds: google.maps.LatLngBounds): string {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}`;
  }

  get(bounds: google.maps.LatLngBounds): any[] | null {
    const key = this.getBoundsKey(bounds);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    // Check if bounds are similar (within 10% tolerance)
    if (this.boundsOverlap(bounds, cached.bounds, 0.9)) {
      return cached.data;
    }
    
    return null;
  }

  set(bounds: google.maps.LatLngBounds, data: any[]): void {
    const key = this.getBoundsKey(bounds);
    this.cache.set(key, {
      bounds,
      data,
      timestamp: Date.now(),
    });
    
    // Clean up old entries
    this.cleanup();
  }

  private boundsOverlap(bounds1: google.maps.LatLngBounds, bounds2: google.maps.LatLngBounds, threshold: number): boolean {
    // Check if bounds intersect by comparing coordinates
    const ne1 = bounds1.getNorthEast();
    const sw1 = bounds1.getSouthWest();
    const ne2 = bounds2.getNorthEast();
    const sw2 = bounds2.getSouthWest();

    const intersects = !(
      ne1.lat() < sw2.lat() ||
      sw1.lat() > ne2.lat() ||
      ne1.lng() < sw2.lng() ||
      sw1.lng() > ne2.lng()
    );

    if (!intersects) return false;

    // Calculate overlap area
    const overlapNorth = Math.min(ne1.lat(), ne2.lat());
    const overlapSouth = Math.max(sw1.lat(), sw2.lat());
    const overlapEast = Math.min(ne1.lng(), ne2.lng());
    const overlapWest = Math.max(sw1.lng(), sw2.lng());

    const area1 = this.getBoundsArea(bounds1);
    const overlapArea = Math.abs(overlapNorth - overlapSouth) * Math.abs(overlapEast - overlapWest);

    return (overlapArea / area1) >= threshold;
  }

  private getBoundsArea(bounds: google.maps.LatLngBounds): number {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return Math.abs(ne.lat() - sw.lat()) * Math.abs(ne.lng() - sw.lng());
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instances
export const territorySnapshotCache = new TerritorySnapshotCache();
export const viewportCache = new ViewportCache();
