
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  BarChartOutlined,
  SettingOutlined,
  CompassOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/outlets',
      icon: <ShopOutlined />,
      label: 'Outlets',
    },
    {
      key: '/routes',
      icon: <EnvironmentOutlined />,
      label: 'Routes',
    },
    {
      key: '/map',
      icon: <CompassOutlined />,
      label: 'Map',
    },
    {
      key: '/territories',
      icon: <GlobalOutlined />,
      label: 'Territories',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className="logo" style={{ 
        height: '64px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white',
        fontSize: collapsed ? '18px' : '24px',
        fontWeight: 'bold',
        margin: '16px 0'
      }}>
        {collapsed ? 'SO' : 'SRTO'}
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;

