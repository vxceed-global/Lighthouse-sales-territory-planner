import { useEffect, useState } from 'react';

interface MapPolylineProps {
  map: google.maps.Map | null;
  path: google.maps.LatLngLiteral[] | google.maps.LatLng[];
  options?: google.maps.PolylineOptions;
  onClick?: (polyline: google.maps.Polyline) => void;
  onMouseOver?: (polyline: google.maps.Polyline) => void;
  onMouseOut?: (polyline: google.maps.Polyline) => void;
}

const MapPolyline: React.FC<MapPolylineProps> = ({
  map,
  path,
  options = {},
  onClick,
  onMouseOver,
  onMouseOut,
}) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  // Create polyline when map is available
  useEffect(() => {
    if (!map) return;

    const newPolyline = new google.maps.Polyline({
      path,
      map,
      strokeColor: '#0088FF',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      ...options,
    });

    if (onClick) {
      newPolyline.addListener('click', () => onClick(newPolyline));
    }

    if (onMouseOver) {
      newPolyline.addListener('mouseover', () => onMouseOver(newPolyline));
    }

    if (onMouseOut) {
      newPolyline.addListener('mouseout', () => onMouseOut(newPolyline));
    }

    setPolyline(newPolyline);

    return () => {
      newPolyline.setMap(null);
    };
  }, [map]);

  // Update polyline path when path prop changes
  useEffect(() => {
    if (polyline) {
      polyline.setPath(path);
    }
  }, [polyline, path]);

  // Update polyline options when options prop changes
  useEffect(() => {
    if (polyline && options) {
      polyline.setOptions(options);
    }
  }, [polyline, options]);

  return null; // This component doesn't render anything
};

export default MapPolyline;
