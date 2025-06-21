import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Tooltip,
  Divider,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { useGetOutletQuery, useDeleteOutletMutation } from '../../../store';
import type { Outlet } from '../../../types';
import { getErrorMessage, logError } from '../../../utils/errorHandling';
import OutletForm from '../OutletForm/OutletForm';

const { Title, Text } = Typography;

interface OutletDetailsProps {
  outletId: string;
  onEdit?: (outlet: Outlet) => void;
  onClose?: () => void;
  showActions?: boolean;
}

export const OutletDetails: React.FC<OutletDetailsProps> = ({
  outletId,
  onEdit,
  onClose,
  showActions = true,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // RTK Query hooks
  const {
    data: outletResponse,
    isLoading,
    error,
    refetch,
  } = useGetOutletQuery(outletId);

  const [deleteOutlet, { isLoading: isDeleting }] = useDeleteOutletMutation();

  const outlet = outletResponse?.data;

  // Handlers
  const handleEdit = () => {
    if (outlet) {
      if (onEdit) {
        onEdit(outlet);
      } else {
        setEditModalVisible(true);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOutlet(outletId).unwrap();
      message.success('Outlet deleted successfully');
      setDeleteModalVisible(false);
      onClose?.();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'delete outlet',
        entityType: 'outlet',
        entityId: outletId,
      });
      message.error(errorMessage);
      logError(error, { operation: 'delete_outlet', entityId: outletId });
    }
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    refetch();
    message.success('Outlet updated successfully');
  };

  // Helper functions
  const getChannelColor = (channel: string): string => {
    const colors = {
      supermarket: 'blue',
      convenience: 'green',
      horeca: 'orange',
      traditional: 'purple',
    };
    return colors[channel as keyof typeof colors] || 'default';
  };

  const getTierColor = (tier: string): string => {
    const colors = {
      gold: 'gold',
      silver: 'default',
      bronze: 'orange',
    };
    return colors[tier as keyof typeof colors] || 'default';
  };

  const formatCurrency = (value?: number): string => {
    return value ? `$${value.toLocaleString()}` : 'Not specified';
  };

  const formatDate = (dateString?: string): string => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Never';
  };

  // Loading state
  if (isLoading) {
    return (
      <Card loading={true}>
        <div style={{ height: 400 }} />
      </Card>
    );
  }

  // Error state
  if (error || !outlet) {
    const errorMessage = getErrorMessage(error || new Error('Outlet not found'), {
      operation: 'load outlet details',
      entityType: 'outlet',
      entityId: outletId,
    });

    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="danger">{errorMessage}</Text>
          <br />
          <Button type="primary" onClick={() => refetch()} style={{ marginTop: 16 }}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              {outlet.name}
            </Title>
            <Tag color={getChannelColor(outlet.channel)}>
              {outlet.channel.toUpperCase()}
            </Tag>
            <Tag color={getTierColor(outlet.tier)}>
              {outlet.tier.toUpperCase()}
            </Tag>
          </Space>
        }
        extra={
          showActions && (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Edit
              </Button>
              {onClose && (
                <Button onClick={onClose}>
                  Close
                </Button>
              )}
            </Space>
          )
        }
      >
        {/* Key Metrics Row */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="Sales Volume"
              value={outlet.salesVolume || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="NPPD Score"
              value={outlet.nppdScore || 0}
              suffix="%"
              prefix={<TrophyOutlined />}
              precision={1}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Service Time"
              value={outlet.serviceTime}
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Last Visit"
              value={formatDate(outlet.lastVisit)}
              prefix={<CalendarOutlined />}
            />
          </Col>
        </Row>

        <Divider />

        {/* Detailed Information */}
        <Descriptions
          title="Outlet Information"
          bordered
          column={2}
          size="small"
        >
          <Descriptions.Item label="Outlet ID" span={1}>
            <Text code>{outlet.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name" span={1}>
            <Text strong>{outlet.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            <Space>
              <EnvironmentOutlined />
              <Text>{outlet.address}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Coordinates" span={2}>
            <Text code>
              {outlet.location.lat.toFixed(6)}, {outlet.location.lng.toFixed(6)}
            </Text>
            <Tooltip title="View on map">
              <Button
                type="link"
                size="small"
                icon={<EnvironmentOutlined />}
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${outlet.location.lat},${outlet.location.lng}`;
                  window.open(url, '_blank');
                }}
              >
                View on Map
              </Button>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Channel">
            <Tag color={getChannelColor(outlet.channel)}>
              {outlet.channel.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tier">
            <Tag color={getTierColor(outlet.tier)}>
              {outlet.tier.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Sales Volume">
            {formatCurrency(outlet.salesVolume)}
          </Descriptions.Item>
          <Descriptions.Item label="NPPD Score">
            {outlet.nppdScore ? `${outlet.nppdScore.toFixed(1)}%` : 'Not calculated'}
          </Descriptions.Item>
          <Descriptions.Item label="Service Time">
            {outlet.serviceTime} minutes
          </Descriptions.Item>
          <Descriptions.Item label="Last Visit">
            {formatDate(outlet.lastVisit)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* Assignment Information */}
        <Descriptions
          title="Assignment Information"
          bordered
          column={2}
          size="small"
        >
          <Descriptions.Item label="Assigned Territory">
            {outlet.assignedTerritory ? (
              <Space>
                <TeamOutlined />
                <Text>{outlet.assignedTerritory}</Text>
                <Button type="link" size="small">
                  View Territory
                </Button>
              </Space>
            ) : (
              <Text type="secondary">Not assigned</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Assigned Route">
            {outlet.assignedRoute ? (
              <Space>
                <CarOutlined />
                <Text>{outlet.assignedRoute}</Text>
                <Button type="link" size="small">
                  View Route
                </Button>
              </Space>
            ) : (
              <Text type="secondary">Not assigned</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Outlet"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <OutletForm
          mode="edit"
          initialValues={outlet}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditModalVisible(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={isDeleting}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete the outlet "{outlet.name}"?
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default OutletDetails;