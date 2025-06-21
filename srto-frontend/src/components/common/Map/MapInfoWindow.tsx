import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface MapInfoWindowProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  anchor?: google.maps.Marker;
  onClose?: () => void;
  children: React.ReactNode;
  options?: google.maps.InfoWindowOptions;
}

const MapInfoWindow: React.FC<MapInfoWindowProps> = ({
  map,
  position,
  anchor,
  onClose,
  children,
  options = {},
}) => {
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [contentElement] = useState(() => document.createElement('div'));

  // Create info window when map is available
  useEffect(() => {
    if (!map) return;

    const newInfoWindow = new google.maps.InfoWindow({
      position,
      ...options,
    });

    if (onClose) {
      newInfoWindow.addListener('closeclick', onClose);
    }

    setInfoWindow(newInfoWindow);

    return () => {
      newInfoWindow.close();
    };
  }, [map]);

  // Update content when children change
  useEffect(() => {
    if (infoWindow) {
      const root = createRoot(contentElement);
      root.render(<>{children}</>);
      infoWindow.setContent(contentElement);
    }

    return () => {
      if (contentElement) {
        // Clean up React root when component unmounts
        const root = createRoot(contentElement);
        root.unmount();
      }
    };
  }, [infoWindow, children, contentElement]);

  // Open info window when anchor or position changes
  useEffect(() => {
    if (!infoWindow || !map) return;

    if (anchor) {
      infoWindow.open({
        map,
        anchor,
      });
    } else {
      infoWindow.setPosition(position);
      infoWindow.open(map);
    }
  }, [infoWindow, map, anchor, position]);

  return null; // This component doesn't render anything
};

export default MapInfoWindow;
