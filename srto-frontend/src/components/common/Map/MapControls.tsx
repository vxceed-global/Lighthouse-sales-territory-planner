import { Button, Tooltip, Space } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  EnvironmentOutlined, 
  FullscreenOutlined,
  BgColorsOutlined
} from '@ant-design/icons';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMyLocation?: () => void;
  onFullscreen?: () => void;
  onChangeStyle?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onMyLocation,
  onFullscreen,
  onChangeStyle,
  className = '',
  style = {},
}) => {
  return (
    <div 
      className={`map-controls ${className}`}
      style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1,
        ...style 
      }}
    >
      <Space direction="vertical" size="small">
        {onZoomIn && (
          <Tooltip title="Zoom In" placement="left">
            <Button 
              icon={<ZoomInOutlined />} 
              onClick={onZoomIn}
              shape="circle"
            />
          </Tooltip>
        )}
        
        {onZoomOut && (
          <Tooltip title="Zoom Out" placement="left">
            <Button 
              icon={<ZoomOutOutlined />} 
              onClick={onZoomOut}
              shape="circle"
            />
          </Tooltip>
        )}
        
        {onMyLocation && (
          <Tooltip title="My Location" placement="left">
            <Button 
              icon={<EnvironmentOutlined />} 
              onClick={onMyLocation}
              shape="circle"
            />
          </Tooltip>
        )}
        
        {onFullscreen && (
          <Tooltip title="Fullscreen" placement="left">
            <Button 
              icon={<FullscreenOutlined />} 
              onClick={onFullscreen}
              shape="circle"
            />
          </Tooltip>
        )}
        
        {onChangeStyle && (
          <Tooltip title="Change Map Style" placement="left">
            <Button 
              icon={<BgColorsOutlined />} 
              onClick={onChangeStyle}
              shape="circle"
            />
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

export default MapControls;
