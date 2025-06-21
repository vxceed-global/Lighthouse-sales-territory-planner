import { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { loadGoogleMaps, DEFAULT_CENTER, DEFAULT_ZOOM } from '@services/googleMaps';

export interface GoogleMapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapOptions?: google.maps.MapOptions;
  mapStyles?: google.maps.MapTypeStyle[];
  onMapLoad?: (map: google.maps.Map) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds | null) => void;
  onCenterChanged?: (center: google.maps.LatLng) => void;
  onZoomChanged?: (zoom: number) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  mapOptions = {},
  mapStyles = [],
  onMapLoad,
  onBoundsChanged,
  onCenterChanged,
  onZoomChanged,
  children,
  className = '',
  style = {},
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Initializing Google Map...');

        // Wait for Google Maps to be fully loaded
        await loadGoogleMaps();
        console.log('Google Maps loaded, checking availability...');

        // Wait a bit more to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if google.maps is available
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not available on window.google.maps');
        }

        console.log('Available in window.google.maps:', Object.keys(window.google.maps));

        // Check specifically for Map constructor
        if (!window.google.maps.Map) {
          console.error('Map constructor not found. Available:', Object.keys(window.google.maps));
          throw new Error('Google Maps Map constructor is not available');
        }

        console.log('Creating map instance with Map constructor...');
        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: mapStyles,
          ...mapOptions,
        });

        console.log('Map instance created successfully:', mapInstance);

        // Set up event listeners
        if (onBoundsChanged) {
          mapInstance.addListener('bounds_changed', () => {
            onBoundsChanged(mapInstance.getBounds() || null);
          });
        }

        if (onCenterChanged) {
          mapInstance.addListener('center_changed', () => {
            onCenterChanged(mapInstance.getCenter() as google.maps.LatLng);
          });
        }

        if (onZoomChanged) {
          mapInstance.addListener('zoom_changed', () => {
            onZoomChanged(mapInstance.getZoom() as number);
          });
        }

        setMap(mapInstance);
        if (onMapLoad) onMapLoad(mapInstance);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing Google Map:', err);
        setError('Failed to load Google Maps. Please check your API key and try again.');
        setLoading(false);
      }
    };

    initMap();

    return () => {
      // Clean up event listeners if needed
    };
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

  return (
    <div className={`google-map-container ${className}`} style={{ position: 'relative', ...style }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}>
          <Spin size="large" tip="Loading map..." />
        </div>
      )}
      
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: 20,
          color: '#ff4d4f',
          zIndex: 1
        }}>
          {error}
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '400px',
          borderRadius: '8px',
        }}
      />
      
      {map && children}
    </div>
  );
};

export default GoogleMap;