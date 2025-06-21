
import { Layout, Button, Space, Dropdown, Avatar, Badge } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined, 
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, toggle }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <AntHeader style={{ 
      padding: '0 16px', 
      background: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />
      
      <div className="logo" style={{ display: collapsed ? 'none' : 'block' }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>SRTO</h1>
      </div>
      
      <Space size="large">
        <Badge count={5} size="small">
          <Button type="text" icon={<BellOutlined />} shape="circle" />
        </Badge>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar style={{ backgroundColor: '#7C00EF', cursor: 'pointer' }} icon={<UserOutlined />} />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;

