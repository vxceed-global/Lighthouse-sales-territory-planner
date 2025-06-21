
import { Row, Col, Card, Statistic, Button, Space, Table, Typography } from 'antd';
import { 
  ShopOutlined, 
  EnvironmentOutlined, 
  GlobalOutlined, 
  CarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface RouteData {
  key: string;
  name: string;
  outlets: number;
  distance: number;
  duration: number;
  status: string;
}

const Dashboard = () => {
  // Sample data - would come from Redux in a real app
  const routeColumns: ColumnsType<RouteData> = [
    {
      title: 'Route Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Outlets',
      dataIndex: 'outlets',
      key: 'outlets',
    },
    {
      title: 'Distance (km)',
      dataIndex: 'distance',
      key: 'distance',
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === 'Completed' ? '#52C41A' : 
                 status === 'In Progress' ? '#FAAD14' : '#1890FF' 
        }}>
          {status}
        </span>
      ),
    },
  ];
  
  const routeData: RouteData[] = [
    {
      key: '1',
      name: 'North Territory Route 1',
      outlets: 12,
      distance: 45.2,
      duration: 240,
      status: 'Completed',
    },
    {
      key: '2',
      name: 'Central Territory Route 3',
      outlets: 8,
      distance: 32.7,
      duration: 180,
      status: 'In Progress',
    },
    {
      key: '3',
      name: 'South Territory Route 2',
      outlets: 15,
      distance: 52.1,
      duration: 300,
      status: 'Planned',
    },
  ];

  return (
    <div className="dashboard-container" style={{ width: '100%' }}>
      <Title level={2}>Dashboard</Title>
      <Text type="secondary" className="mb-lg" style={{ display: 'block' }}>
        Welcome to the Sales Route & Territory Optimizer
      </Text>
      
      <Row gutter={[16, 16]} className="mb-lg">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Outlets" 
              value={248} 
              prefix={<ShopOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Active Routes" 
              value={12} 
              prefix={<EnvironmentOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Territories" 
              value={5} 
              prefix={<GlobalOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Distance" 
              value={1254} 
              suffix="km"
              prefix={<CarOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="mb-lg">
        <Col xs={24} lg={12}>
          <Card 
            title="Performance Metrics" 
            extra={<Button type="link">View All</Button>}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Outlets Visited"
                  value={42}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Fuel Consumption"
                  value={12}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Optimization Summary" 
            extra={<Button type="link">Details</Button>}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Time Saved"
                  value={128}
                  suffix="hrs"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Distance Reduced"
                  value={345}
                  suffix="km"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Card 
        title="Recent Routes" 
        extra={
          <Space>
            <Button>Create Route</Button>
            <Button type="primary">Optimize</Button>
          </Space>
        }
      >
        <Table 
          columns={routeColumns} 
          dataSource={routeData} 
          pagination={false} 
        />
      </Card>
    </div>
  );
};

export default Dashboard;

