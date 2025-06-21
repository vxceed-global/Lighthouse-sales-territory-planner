import { useState, useEffect, useCallback } from 'react';
import { loadGoogleMaps, DEFAULT_CENTER, DEFAULT_ZOOM } from '@services/googleMaps';

interface UseGoogleMapsOptions {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapOptions?: google.maps.MapOptions;
  mapStyles?: google.maps.MapTypeStyle[];
}

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  loadError: Error | null;
  map: google.maps.Map | null;
  maps: typeof google.maps | null;
  setCenter: (center: google.maps.LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  fitBounds: (bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral) => void;
  panTo: (latLng: google.maps.LatLngLiteral) => void;
}

const useGoogleMaps = (
  mapRef: React.RefObject<HTMLDivElement>,
  options: UseGoogleMapsOptions = {}
): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [maps, setMaps] = useState<typeof google.maps | null>(null);

  const {
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    mapOptions = {},
    mapStyles = [],
  } = options;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const googleMaps = await loadGoogleMaps();
        setMaps(googleMaps);

        const mapInstance = new googleMaps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: mapStyles,
          ...mapOptions,
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        setLoadError(error instanceof Error ? error : new Error('Failed to load Google Maps'));
      }
    };

    initMap();
  }, [mapRef]);

  // Update map center when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center.lat, center.lng]);

  // Update map zoom when zoom prop changes
  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  // Update map styles when mapStyles prop changes
  useEffect(() => {
    if (map && mapStyles) {
      map.setOptions({ styles: mapStyles });
    }
  }, [map, mapStyles]);

  // Helper functions
  const setCenter = useCallback(
    (newCenter: google.maps.LatLngLiteral) => {
      if (map) {
        map.setCenter(newCenter);
      }
    },
    [map]
  );

  const setZoom = useCallback(
    (newZoom: number) => {
      if (map) {
        map.setZoom(newZoom);
      }
    },
    [map]
  );

  const fitBounds = useCallback(
    (bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral) => {
      if (map) {
        map.fitBounds(bounds);
      }
    },
    [map]
  );

  const panTo = useCallback(
    (latLng: google.maps.LatLngLiteral) => {
      if (map) {
        map.panTo(latLng);
      }
    },
    [map]
  );

  return {
    isLoaded,
    loadError,
    map,
    maps,
    setCenter,
    setZoom,
    fitBounds,
    panTo,
  };
};

export default useGoogleMaps;