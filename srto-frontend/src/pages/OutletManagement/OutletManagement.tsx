import React, { useState } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Tabs,
  Drawer,
} from 'antd';
import {
  ShopOutlined,
  PlusOutlined,
  ImportOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  OutletList,
  OutletDetails,
  OutletForm,
  ImportWizard,
} from '../../components/outlets';
import { useGetOutletsQuery } from '../../store';
import type { Outlet } from '../../types';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

export const OutletManagement: React.FC = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [importWizardVisible, setImportWizardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Get outlets data for statistics
  const { data: outletsResponse } = useGetOutletsQuery({
    page: 1,
    limit: 1, // Just for getting total count
  });

  const totalOutlets = outletsResponse?.pagination?.total || 0;

  // Handle outlet selection
  const handleOutletSelect = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setDetailsDrawerVisible(true);
  };

  // Handle outlet edit
  const handleOutletEdit = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    // Could open edit modal or navigate to edit page
  };

  // Statistics data (in real app, this would come from analytics API)
  const statistics = {
    totalOutlets,
    byChannel: {
      supermarket: Math.floor(totalOutlets * 0.3),
      convenience: Math.floor(totalOutlets * 0.4),
      horeca: Math.floor(totalOutlets * 0.2),
      traditional: Math.floor(totalOutlets * 0.1),
    },
    byTier: {
      gold: Math.floor(totalOutlets * 0.2),
      silver: Math.floor(totalOutlets * 0.5),
      bronze: Math.floor(totalOutlets * 0.3),
    },
    assigned: Math.floor(totalOutlets * 0.85),
    unassigned: Math.floor(totalOutlets * 0.15),
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                <ShopOutlined style={{ marginRight: 8 }} />
                Outlet Management
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                >
                  Add Outlet
                </Button>
                <Button
                  icon={<ImportOutlined />}
                  onClick={() => setImportWizardVisible(true)}
                >
                  Import Outlets
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Outlets"
                value={statistics.totalOutlets}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Assigned to Territory"
                value={statistics.assigned}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Unassigned"
                value={statistics.unassigned}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Coverage Rate"
                value={((statistics.assigned / statistics.totalOutlets) * 100).toFixed(1)}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Channel Distribution */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="Distribution by Channel" size="small">
              <Row gutter={8}>
                <Col span={6}>
                  <Statistic
                    title="Supermarket"
                    value={statistics.byChannel.supermarket}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Convenience"
                    value={statistics.byChannel.convenience}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="HoReCa"
                    value={statistics.byChannel.horeca}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Traditional"
                    value={statistics.byChannel.traditional}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Distribution by Tier" size="small">
              <Row gutter={8}>
                <Col span={8}>
                  <Statistic
                    title="Gold"
                    value={statistics.byTier.gold}
                    valueStyle={{ fontSize: 16, color: '#faad14' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Silver"
                    value={statistics.byTier.silver}
                    valueStyle={{ fontSize: 16, color: '#8c8c8c' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Bronze"
                    value={statistics.byTier.bronze}
                    valueStyle={{ fontSize: 16, color: '#d4380d' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Outlet List" key="list">
              <OutletList
                onOutletSelect={handleOutletSelect}
                onOutletEdit={handleOutletEdit}
                selectable={true}
                showActions={true}
              />
            </TabPane>
            <TabPane tab="Map View" key="map">
              <div style={{ height: 600, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">
                  Map view will be implemented with Google Maps integration
                </Typography.Text>
              </div>
            </TabPane>
            <TabPane tab="Analytics" key="analytics">
              <div style={{ height: 600, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">
                  Analytics dashboard will be implemented in Phase 2.4
                </Typography.Text>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Outlet Details Drawer */}
        <Drawer
          title="Outlet Details"
          placement="right"
          width={800}
          open={detailsDrawerVisible}
          onClose={() => {
            setDetailsDrawerVisible(false);
            setSelectedOutlet(null);
          }}
          destroyOnClose
        >
          {selectedOutlet && (
            <OutletDetails
              outletId={selectedOutlet.id}
              onEdit={handleOutletEdit}
              onClose={() => {
                setDetailsDrawerVisible(false);
                setSelectedOutlet(null);
              }}
              showActions={true}
            />
          )}
        </Drawer>

        {/* Create Outlet Modal */}
        {createModalVisible && (
          <OutletForm
            mode="create"
            onSuccess={() => {
              setCreateModalVisible(false);
              // Refresh outlet list
            }}
            onCancel={() => setCreateModalVisible(false)}
          />
        )}

        {/* Import Wizard */}
        <ImportWizard
          visible={importWizardVisible}
          onClose={() => setImportWizardVisible(false)}
          onSuccess={() => {
            setImportWizardVisible(false);
            // Refresh outlet list and show success message
          }}
        />
      </Content>
    </Layout>
  );
};

export default OutletManagement;
