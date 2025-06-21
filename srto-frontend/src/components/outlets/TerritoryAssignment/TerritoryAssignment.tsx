import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  Select,
  Button,
  Space,
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Typography,
  Tag,
  message,
} from 'antd';
import {
  EnvironmentOutlined,
  TeamOutlined,

  SwapOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import {
  useGetTerritoriesQuery,
  useAssignOutletsToTerritoryMutation,
  useAutoAssignOutletsMutation,
  useGetOutletsByTerritoryQuery,
} from '../../../store';
import type { Outlet, Territory } from '../../../types';
import { getErrorMessage, logError } from '../../../utils/errorHandling';

const { Option } = Select;
const { Text } = Typography;

interface TerritoryAssignmentProps {
  visible: boolean;
  onClose: () => void;
  selectedOutlets: Outlet[];
  onSuccess?: () => void;
}

interface AssignmentConflict {
  outletId: string;
  outletName: string;
  currentTerritory?: string;
  suggestedTerritories: string[];
  reason: string;
}

interface AssignmentPreview {
  territoryId: string;
  territoryName: string;
  currentOutlets: number;
  newOutlets: number;
  totalAfterAssignment: number;
  capacityWarning?: boolean;
}

export const TerritoryAssignment: React.FC<TerritoryAssignmentProps> = ({
  visible,
  onClose,
  selectedOutlets,
  onSuccess,
}) => {
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);
  const [assignmentStrategy, setAssignmentStrategy] = useState<'manual' | 'auto'>('manual');
  const [autoStrategy, setAutoStrategy] = useState<'nearest' | 'balanced' | 'sales_volume'>('nearest');
  const [conflicts, setConflicts] = useState<AssignmentConflict[]>([]);
  const [preview, setPreview] = useState<AssignmentPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // RTK Query hooks
  const { data: territoriesResponse, isLoading: isLoadingTerritories } = useGetTerritoriesQuery({
    page: 1,
    limit: 100,
  });

  const { data: currentOutletsResponse } = useGetOutletsByTerritoryQuery(
    selectedTerritoryId!,
    { skip: !selectedTerritoryId }
  );

  const [assignOutletsToTerritory, { isLoading: isAssigning }] = useAssignOutletsToTerritoryMutation();
  const [autoAssignOutlets, { isLoading: isAutoAssigning }] = useAutoAssignOutletsMutation();

  const territories = territoriesResponse?.data || [];
  const currentOutlets = currentOutletsResponse?.data || [];

  // Calculate assignment preview
  const calculatePreview = useCallback((territoryId: string) => {
    const territory = territories.find(t => t.id === territoryId);
    if (!territory) return null;

    const currentCount = currentOutlets.length;
    const newCount = selectedOutlets.length;
    const totalAfter = currentCount + newCount;

    // Check capacity warning (assuming max 1000 outlets per territory)
    const capacityWarning = totalAfter > 1000;

    const preview: AssignmentPreview = {
      territoryId,
      territoryName: territory.name,
      currentOutlets: currentCount,
      newOutlets: newCount,
      totalAfterAssignment: totalAfter,
      capacityWarning,
    };

    return preview;
  }, [territories, currentOutlets, selectedOutlets]);

  // Handle territory selection
  const handleTerritorySelect = (territoryId: string) => {
    setSelectedTerritoryId(territoryId);
    const previewData = calculatePreview(territoryId);
    setPreview(previewData);
    setShowPreview(true);

    // Check for conflicts
    const conflictingOutlets = selectedOutlets.filter(outlet => 
      outlet.assignedTerritory && outlet.assignedTerritory !== territoryId
    );

    const newConflicts: AssignmentConflict[] = conflictingOutlets.map(outlet => ({
      outletId: outlet.id,
      outletName: outlet.name,
      currentTerritory: outlet.assignedTerritory,
      suggestedTerritories: [territoryId],
      reason: 'Outlet is already assigned to a different territory',
    }));

    setConflicts(newConflicts);
  };

  // Handle manual assignment
  const handleManualAssignment = async () => {
    if (!selectedTerritoryId) {
      message.error('Please select a territory');
      return;
    }

    try {
      await assignOutletsToTerritory({
        outletIds: selectedOutlets.map(o => o.id),
        territoryId: selectedTerritoryId,
        reason: 'Manual assignment via territory assignment interface',
      }).unwrap();

      message.success(`Successfully assigned ${selectedOutlets.length} outlets to territory`);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'assign outlets to territory',
        entityType: 'outlets',
      });
      message.error(errorMessage);
      logError(error, { operation: 'manual_territory_assignment' });
    }
  };

  // Handle auto assignment
  const handleAutoAssignment = async () => {
    try {
      const result = await autoAssignOutlets({
        outletIds: selectedOutlets.map(o => o.id),
        strategy: autoStrategy,
      }).unwrap();

      const { assigned, unassigned, conflicts: autoConflicts } = result.data;

      if (assigned > 0) {
        message.success(`Successfully assigned ${assigned} outlets automatically`);
      }

      if (unassigned.length > 0) {
        message.warning(`${unassigned.length} outlets could not be assigned automatically`);
      }

      if (autoConflicts.length > 0) {
        setConflicts(autoConflicts.map(conflict => ({
          outletId: conflict.outletId,
          outletName: selectedOutlets.find(o => o.id === conflict.outletId)?.name || 'Unknown',
          currentTerritory: undefined,
          suggestedTerritories: conflict.possibleTerritories,
          reason: 'Multiple territories possible, manual selection required',
        })));
      } else {
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'auto assign outlets',
        entityType: 'outlets',
      });
      message.error(errorMessage);
      logError(error, { operation: 'auto_territory_assignment' });
    }
  };

  // Conflict resolution table columns
  const conflictColumns = [
    {
      title: 'Outlet',
      dataIndex: 'outletName',
      key: 'outletName',
    },
    {
      title: 'Current Territory',
      dataIndex: 'currentTerritory',
      key: 'currentTerritory',
      render: (territory: string) => territory ? (
        <Tag color="blue">{territory}</Tag>
      ) : (
        <Text type="secondary">Unassigned</Text>
      ),
    },
    {
      title: 'Suggested Territories',
      dataIndex: 'suggestedTerritories',
      key: 'suggestedTerritories',
      render: (territoryIds: string[]) => (
        <Space wrap>
          {territoryIds.map(territoryId => {
            const territory = territories.find(t => t.id === territoryId);
            return (
              <Tag key={territoryId} color="green">
                {territory?.name || territoryId}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  // Selected outlets summary
  const outletsSummary = useMemo(() => {
    const channelCounts = selectedOutlets.reduce((acc, outlet) => {
      acc[outlet.channel] = (acc[outlet.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tierCounts = selectedOutlets.reduce((acc, outlet) => {
      acc[outlet.tier] = (acc[outlet.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { channelCounts, tierCounts };
  }, [selectedOutlets]);

  return (
    <Modal
      title="Territory Assignment"
      open={visible}
      onCancel={onClose}
      width={900}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>
              Cancel
            </Button>
            {assignmentStrategy === 'manual' && (
              <Button
                type="primary"
                icon={<TeamOutlined />}
                onClick={handleManualAssignment}
                loading={isAssigning}
                disabled={!selectedTerritoryId}
              >
                Assign to Territory
              </Button>
            )}
            {assignmentStrategy === 'auto' && (
              <Button
                type="primary"
                icon={<BulbOutlined />}
                onClick={handleAutoAssignment}
                loading={isAutoAssigning}
              >
                Auto Assign
              </Button>
            )}
          </Space>
        </div>
      }
      destroyOnClose
    >
      {/* Selected Outlets Summary */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Selected Outlets"
              value={selectedOutlets.length}
              prefix={<EnvironmentOutlined />}
            />
          </Col>
          <Col span={9}>
            <div>
              <Text strong>By Channel:</Text>
              <div style={{ marginTop: 4 }}>
                {Object.entries(outletsSummary.channelCounts).map(([channel, count]) => (
                  <Tag key={channel} style={{ marginBottom: 4 }}>
                    {channel}: {count}
                  </Tag>
                ))}
              </div>
            </div>
          </Col>
          <Col span={9}>
            <div>
              <Text strong>By Tier:</Text>
              <div style={{ marginTop: 4 }}>
                {Object.entries(outletsSummary.tierCounts).map(([tier, count]) => (
                  <Tag key={tier} color={tier === 'gold' ? 'gold' : tier === 'silver' ? 'default' : 'orange'} style={{ marginBottom: 4 }}>
                    {tier}: {count}
                  </Tag>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Assignment Strategy */}
      <Card title="Assignment Strategy" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            value={assignmentStrategy}
            onChange={setAssignmentStrategy}
            style={{ width: 200 }}
          >
            <Option value="manual">Manual Assignment</Option>
            <Option value="auto">Automatic Assignment</Option>
          </Select>

          {assignmentStrategy === 'manual' && (
            <div>
              <Text>Select a territory to assign all selected outlets:</Text>
              <Select
                placeholder="Select territory"
                style={{ width: '100%', marginTop: 8 }}
                loading={isLoadingTerritories}
                onChange={handleTerritorySelect}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {territories.map(territory => (
                  <Option key={territory.id} value={territory.id} label={territory.name}>
                    <Space>
                      <span>{territory.name}</span>
                      <Text type="secondary">({territory.outletCount} outlets)</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {assignmentStrategy === 'auto' && (
            <div>
              <Text>Choose automatic assignment strategy:</Text>
              <Select
                value={autoStrategy}
                onChange={setAutoStrategy}
                style={{ width: '100%', marginTop: 8 }}
              >
                <Option value="nearest">Nearest Territory (by distance)</Option>
                <Option value="balanced">Balanced Distribution (even outlet count)</Option>
                <Option value="sales_volume">Sales Volume Based</Option>
              </Select>
              <Alert
                message="Automatic Assignment"
                description="The system will analyze outlet locations and characteristics to determine the best territory assignment."
                type="info"
                showIcon
                style={{ marginTop: 8 }}
              />
            </div>
          )}
        </Space>
      </Card>

      {/* Assignment Preview */}
      {showPreview && preview && (
        <Card title="Assignment Preview" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Current Outlets"
                value={preview.currentOutlets}
                prefix={<EnvironmentOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="New Outlets"
                value={preview.newOutlets}
                prefix={<SwapOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Total After Assignment"
                value={preview.totalAfterAssignment}
                prefix={<TeamOutlined />}
                valueStyle={{ color: preview.capacityWarning ? '#cf1322' : '#3f8600' }}
              />
            </Col>
          </Row>

          {preview.capacityWarning && (
            <Alert
              message="Capacity Warning"
              description="This territory will have a large number of outlets after assignment. Consider splitting the territory or redistributing outlets."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Card title="Assignment Conflicts" size="small">
          <Alert
            message="Conflicts Detected"
            description="Some outlets have conflicts that need to be resolved before assignment."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={conflictColumns}
            dataSource={conflicts}
            rowKey="outletId"
            size="small"
            pagination={false}
          />
        </Card>
      )}
    </Modal>
  );
};

export default TerritoryAssignment;
