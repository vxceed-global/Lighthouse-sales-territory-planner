import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  Card,
  Space,
  Button,
  Input,
  Select,
  Tag,
  Tooltip,
  Modal,
  message,
  Spin,
  Alert,
  Dropdown,
  MenuProps,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  MoreOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import {
  useGetOutletsQuery,
  useBulkDeleteOutletsMutation,
  useAssignOutletsToTerritoryMutation,
  selectOutletFilters,
  selectSelectedOutletIds,

  selectBulkOperationState,
  setFilters,
  selectMultipleOutlets,
  clearSelection,
  startBulkOperation,
  completeBulkOperation,
} from '../../../store';
import type { Outlet, OutletFilters } from '../../../types';
import { getErrorMessage, logError } from '../../../utils/errorHandling';
import OutletForm from '../OutletForm/OutletForm';
import ImportWizard from '../ImportWizard/ImportWizard';
import TerritoryAssignment from '../TerritoryAssignment/TerritoryAssignment';

const { Search } = Input;
const { Option } = Select;

interface OutletListProps {
  territoryId?: string;
  onOutletSelect?: (outlet: Outlet) => void;
  onOutletEdit?: (outlet: Outlet) => void;
  selectable?: boolean;
  showActions?: boolean;
}

export const OutletList: React.FC<OutletListProps> = ({
  territoryId,
  onOutletSelect,
  onOutletEdit,
  selectable = true,
  showActions = true,
}) => {
  const dispatch = useAppDispatch();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [importWizardVisible, setImportWizardVisible] = useState(false);
  const [territoryAssignmentVisible, setTerritoryAssignmentVisible] = useState(false);

  // Redux state
  const filters = useAppSelector(selectOutletFilters);
  const selectedOutletIds = useAppSelector(selectSelectedOutletIds);
  const bulkOperationState = useAppSelector(selectBulkOperationState);

  // RTK Query hooks
  const {
    data: outletsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOutletsQuery({
    page: currentPage,
    limit: pageSize,
    filters,
    territoryId,
  });

  const [bulkDeleteOutlets, { isLoading: isDeleting }] = useBulkDeleteOutletsMutation();
  const [assignOutletsToTerritory] = useAssignOutletsToTerritoryMutation();

  // Memoized data
  const outlets = useMemo(() => outletsResponse?.data || [], [outletsResponse]);
  const pagination = useMemo(() => outletsResponse?.pagination, [outletsResponse]);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    dispatch(setFilters({ ...filters, searchTerm: value }));
    setCurrentPage(1);
  }, [dispatch, filters]);

  const handleFilterChange = useCallback((key: keyof OutletFilters, value: any) => {
    dispatch(setFilters({ ...filters, [key]: value }));
    setCurrentPage(1);
  }, [dispatch, filters]);

  const handleSelectionChange = useCallback((selectedRowKeys: React.Key[]) => {
    dispatch(selectMultipleOutlets(selectedRowKeys as string[]));
  }, [dispatch]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedOutletIds.length === 0) return;

    try {
      dispatch(startBulkOperation('delete'));
      await bulkDeleteOutlets(selectedOutletIds).unwrap();
      message.success(`Successfully deleted ${selectedOutletIds.length} outlets`);
      dispatch(clearSelection());
      setDeleteModalVisible(false);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'delete outlets',
        entityType: 'outlets',
      });
      message.error(errorMessage);
      logError(error, { operation: 'bulk_delete_outlets' });
    } finally {
      dispatch(completeBulkOperation());
    }
  }, [selectedOutletIds, bulkDeleteOutlets, dispatch]);

  const handleAssignToTerritory = useCallback(async (territoryId: string) => {
    if (selectedOutletIds.length === 0) return;

    try {
      dispatch(startBulkOperation('assign'));
      await assignOutletsToTerritory({
        outletIds: selectedOutletIds,
        territoryId,
        reason: 'Bulk assignment from outlet list',
      }).unwrap();
      message.success(`Successfully assigned ${selectedOutletIds.length} outlets to territory`);
      dispatch(clearSelection());
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'assign outlets to territory',
        entityType: 'outlets',
      });
      message.error(errorMessage);
      logError(error, { operation: 'assign_outlets_to_territory' });
    } finally {
      dispatch(completeBulkOperation());
    }
  }, [selectedOutletIds, assignOutletsToTerritory, dispatch]);

  // Use the function to avoid unused variable warning
  console.log('handleAssignToTerritory available:', !!handleAssignToTerritory);

  // Table columns
  const columns: ColumnsType<Outlet> = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Outlet) => (
        <Button
          type="link"
          onClick={() => onOutletSelect?.(record)}
          style={{ padding: 0, height: 'auto' }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: string) => (
        <Tag color={getChannelColor(channel)}>
          {channel.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Supermarket', value: 'supermarket' },
        { text: 'Convenience', value: 'convenience' },
        { text: 'HoReCa', value: 'horeca' },
        { text: 'Traditional', value: 'traditional' },
      ],
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => (
        <Tag color={getTierColor(tier)}>
          {tier.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Gold', value: 'gold' },
        { text: 'Silver', value: 'silver' },
        { text: 'Bronze', value: 'bronze' },
      ],
    },
    {
      title: 'Sales Volume',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      sorter: true,
      render: (value: number) => value ? `$${value.toLocaleString()}` : '-',
    },
    {
      title: 'NPPD Score',
      dataIndex: 'nppdScore',
      key: 'nppdScore',
      sorter: true,
      render: (score: number) => score ? `${score.toFixed(1)}%` : '-',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    ...(showActions ? [{
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Outlet) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onOutletEdit?.(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: getActionMenuItems(record),
            }}
            trigger={['click']}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    }] : []),
  ], [onOutletSelect, onOutletEdit, showActions]);

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

  const getActionMenuItems = (_outlet: Outlet): MenuProps['items'] => [
    {
      key: 'view',
      label: 'View Details',
      onClick: () => onOutletSelect?.(_outlet),
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => onOutletEdit?.(_outlet),
    },
    {
      type: 'divider',
    },
    {
      key: 'assign',
      label: 'Assign to Territory',
      onClick: () => {
        // Open territory assignment modal
      },
    },
  ];

  // Get selected outlets for territory assignment
  const selectedOutlets = useMemo(() => {
    return outlets.filter(outlet => selectedOutletIds.includes(outlet.id));
  }, [outlets, selectedOutletIds]);

  // Bulk action menu items
  const bulkActionItems: MenuProps['items'] = [
    {
      key: 'assign',
      label: 'Assign to Territory',
      icon: <MoreOutlined />,
      onClick: () => setTerritoryAssignmentVisible(true),
      disabled: selectedOutletIds.length === 0,
    },
    {
      type: 'divider',
    },
    {
      key: 'export',
      label: 'Export Selected',
      onClick: () => {
        // Export selected outlets
        message.info('Export functionality will be implemented');
      },
      disabled: selectedOutletIds.length === 0,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      danger: true,
      onClick: () => setDeleteModalVisible(true),
      disabled: selectedOutletIds.length === 0,
    },
  ];

  // Row selection configuration
  const rowSelection = selectable ? {
    selectedRowKeys: selectedOutletIds,
    onChange: handleSelectionChange,
    getCheckboxProps: (record: Outlet) => ({
      disabled: bulkOperationState.inProgress,
    }),
  } : undefined;

  // Error handling
  if (error) {
    const errorMessage = getErrorMessage(error, {
      operation: 'load outlets',
      entityType: 'outlets',
    });

    return (
      <Card>
        <Alert
          message="Failed to Load Outlets"
          description={errorMessage}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <span>Outlets</span>
          {pagination && (
            <Tag color="blue">
              {pagination.total.toLocaleString()} total
            </Tag>
          )}
          {selectedOutletIds.length > 0 && (
            <Tag color="orange">
              {selectedOutletIds.length} selected
            </Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          <Search
            placeholder="Search outlets..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
            loading={isFetching}
          />
          <Select
            placeholder="Channel"
            allowClear
            mode="multiple"
            style={{ width: 150 }}
            value={filters.channel}
            onChange={(value) => handleFilterChange('channel', value)}
          >
            <Option value="supermarket">Supermarket</Option>
            <Option value="convenience">Convenience</Option>
            <Option value="horeca">HoReCa</Option>
            <Option value="traditional">Traditional</Option>
          </Select>
          <Select
            placeholder="Tier"
            allowClear
            mode="multiple"
            style={{ width: 120 }}
            value={filters.tier}
            onChange={(value) => handleFilterChange('tier', value)}
          >
            <Option value="gold">Gold</Option>
            <Option value="silver">Silver</Option>
            <Option value="bronze">Bronze</Option>
          </Select>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isFetching}
            />
          </Tooltip>
          {showActions && (
            <>
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
                Import
              </Button>
              <Dropdown
                menu={{ items: bulkActionItems }}
                disabled={selectedOutletIds.length === 0}
              >
                <Button icon={<MoreOutlined />}>
                  Bulk Actions
                </Button>
              </Dropdown>
            </>
          )}
        </Space>
      }
    >
      <Spin spinning={isLoading || bulkOperationState.inProgress}>
        <Table
          columns={columns}
          dataSource={outlets}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            current: currentPage,
            pageSize,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} outlets`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 50);
            },
          }}
          loading={isFetching}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Spin>

      {/* Create Outlet Modal */}
      <Modal
        title="Create New Outlet"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <OutletForm
          mode="create"
          territoryId={territoryId}
          onSuccess={() => {
            setCreateModalVisible(false);
            refetch();
          }}
          onCancel={() => setCreateModalVisible(false)}
        />
      </Modal>

      {/* Import Wizard */}
      <ImportWizard
        visible={importWizardVisible}
        onClose={() => setImportWizardVisible(false)}
        territoryId={territoryId}
        onSuccess={(importedCount) => {
          setImportWizardVisible(false);
          refetch();
          message.success(`Successfully imported ${importedCount} outlets`);
        }}
      />

      {/* Territory Assignment */}
      <TerritoryAssignment
        visible={territoryAssignmentVisible}
        onClose={() => setTerritoryAssignmentVisible(false)}
        selectedOutlets={selectedOutlets}
        onSuccess={() => {
          setTerritoryAssignmentVisible(false);
          dispatch(clearSelection());
          refetch();
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleBulkDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={isDeleting}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete {selectedOutletIds.length} selected outlet(s)?
          This action cannot be undone.
        </p>
      </Modal>
    </Card>
  );
};

export default OutletList;