import { useState, useRef } from 'react';
import { Card, Typography, Select, Button, message } from 'antd';
import { 
  GoogleMap, 
  MapControls, 
  MapMarker, 
  MapPolyline,
  MapInfoWindow 
} from '@components/common/Map';
import { mapStyles } from '@services/googleMaps';
import './MapPage.css';

const { Title } = Typography;
const { Option } = Select;

// Sample data
const sampleOutlets = [
  { id: '1', name: 'Outlet 1', position: { lat: 12.9716, lng: 77.5946 } },
  { id: '2', name: 'Outlet 2', position: { lat: 12.9816, lng: 77.6046 } },
  { id: '3', name: 'Outlet 3', position: { lat: 12.9616, lng: 77.5846 } },
];

const sampleRoute = [
  { lat: 12.9716, lng: 77.5946 },
  { lat: 12.9816, lng: 77.6046 },
  { lat: 12.9616, lng: 77.5846 },
  { lat: 12.9716, lng: 77.5946 },
];

const MapPage = () => {
  const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>('default');
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    console.log('Map loaded successfully:', map);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      mapRef.current.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      mapRef.current.setZoom(currentZoom - 1);
      setZoom(currentZoom - 1);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          message.success('Location found');
        },
        () => {
          message.error('Error: The Geolocation service failed');
        }
      );
    } else {
      message.error('Error: Your browser doesn\'t support geolocation');
    }
  };

  const handleChangeStyle = () => {
    const styles = Object.keys(mapStyles) as Array<keyof typeof mapStyles>;
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
    message.info(`Map style changed to ${styles[nextIndex]}`);
  };

  const handleMarkerClick = (outletId: string) => {
    setSelectedOutlet(outletId);
    const outlet = sampleOutlets.find(o => o.id === outletId);
    if (outlet) {
      setCenter(outlet.position);
      setInfoWindowPosition(outlet.position);
      setShowInfoWindow(true);
    }
  };

  const handleInfoWindowClose = () => {
    setShowInfoWindow(false);
    setSelectedOutlet(null);
  };

  return (
    <div
      className="map-page"
      style={{
        padding: '24px',
        height: '100vh',
        background: '#f5f7fa',
        overflow: 'hidden'
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 16 }}>Map</Title>

        <div
          className="map-controls"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div
            className="map-controls-left"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <Select
              value={mapStyle}
              onChange={setMapStyle}
              style={{ width: 150 }}
              placeholder="Map Style"
            >
              {Object.keys(mapStyles).map((style) => (
                <Option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Option>
              ))}
            </Select>

            <Button
              type={showRoute ? 'primary' : 'default'}
              onClick={() => setShowRoute(!showRoute)}
            >
              {showRoute ? 'Hide Route' : 'Show Route'}
            </Button>
          </div>

          <div
            className="map-controls-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}
          >
            <span style={{ color: '#64748b', marginRight: '8px' }}>Selected Outlet:</span>
            <span style={{ color: '#1890ff', fontWeight: 600 }}>
              {selectedOutlet ? sampleOutlets.find(o => o.id === selectedOutlet)?.name : 'None'}
            </span>
          </div>
        </div>
      </div>

      <Card
        className="map-container"
        bodyStyle={{ padding: 0, height: '100%' }}
        style={{
          height: 'calc(100vh - 220px)',
          minHeight: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          background: 'white'
        }}
      >
        <GoogleMap
          center={center}
          zoom={zoom}
          mapStyles={mapStyles[mapStyle]}
          onMapLoad={handleMapLoad}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: '12px'
          }}
        >
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onMyLocation={handleMyLocation}
            onChangeStyle={handleChangeStyle}
          />
          
          {sampleOutlets.map((outlet) => (
            <MapMarker
              key={outlet.id}
              map={mapRef.current}
              position={outlet.position}
              title={outlet.name}
              onClick={() => handleMarkerClick(outlet.id)}
            />
          ))}
          
          {showRoute && (
            <MapPolyline
              map={mapRef.current}
              path={sampleRoute}
              options={{
                strokeColor: '#0088FF',
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          )}
          
          {selectedOutlet && (
            <MapInfoWindow
              map={mapRef.current}
              position={sampleOutlets.find(o => o.id === selectedOutlet)?.position || center}
              onClose={() => setSelectedOutlet(null)}
              options={{
                maxWidth: 320,
                pixelOffset: new google.maps.Size(0, -30),
              }}
            >
              <div style={{
                padding: '20px',
                minWidth: '280px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                lineHeight: '1.5',
                backgroundColor: 'white',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#1f2937',
                    lineHeight: '1.2'
                  }}>
                    {sampleOutlets.find(o => o.id === selectedOutlet)?.name}
                  </h3>
                </div>
                <p style={{
                  margin: '0 0 20px 0',
                  fontSize: '15px',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  {sampleOutlets.find(o => o.id === selectedOutlet)?.description}
                </p>
                <Button
                  type="primary"
                  size="middle"
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    height: '40px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                    border: 'none'
                  }}
                  onClick={() => {
                    message.info(`Viewing details for ${sampleOutlets.find(o => o.id === selectedOutlet)?.name}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </MapInfoWindow>
          )}
        </GoogleMap>
      </Card>
    </div>
  );
};

export default MapPage;
