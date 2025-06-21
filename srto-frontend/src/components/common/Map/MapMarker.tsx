import { useEffect, useState } from 'react';

interface MapMarkerProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  title?: string;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onClick?: (marker: google.maps.Marker) => void;
  draggable?: boolean;
  onDragEnd?: (position: google.maps.LatLng) => void;
  zIndex?: number;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  map,
  position,
  title,
  icon,
  onClick,
  draggable = false,
  onDragEnd,
  zIndex,
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  // Create marker when map is available
  useEffect(() => {
    if (!map) return;

    const newMarker = new google.maps.Marker({
      position,
      map,
      title,
      icon,
      draggable,
      zIndex,
    });

    if (onClick) {
      newMarker.addListener('click', () => onClick(newMarker));
    }

    if (draggable && onDragEnd) {
      newMarker.addListener('dragend', () => {
        const newPosition = newMarker.getPosition();
        if (newPosition) {
          onDragEnd(newPosition);
        }
      });
    }

    setMarker(newMarker);

    return () => {
      newMarker.setMap(null);
    };
  }, [map]);

  // Update marker position when position prop changes
  useEffect(() => {
    if (marker) {
      marker.setPosition(position);
    }
  }, [marker, position.lat, position.lng]);

  // Update marker icon when icon prop changes
  useEffect(() => {
    if (marker && icon) {
      marker.setIcon(icon);
    }
  }, [marker, icon]);

  // Update marker title when title prop changes
  useEffect(() => {
    if (marker && title) {
      marker.setTitle(title);
    }
  }, [marker, title]);

  return null; // This component doesn't render anything
};

export default MapMarker;
