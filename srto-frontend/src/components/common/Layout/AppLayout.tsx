
import { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} toggle={toggleSidebar} />
        <Content style={{ 
          margin: '16px', 
          padding: 24, 
          background: '#fff', 
          borderRadius: 8,
          minHeight: 'calc(100vh - 96px)' // Account for header height and margins
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

