import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Card,
  Alert,
  message,
  Tooltip,
  Typography,
} from 'antd';
import {
  EnvironmentOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useValidateOutletCoordinatesMutation,
} from '../../../store';
import type { Outlet } from '../../../types';
import { validateOutlet, ValidationResult } from '../../../utils/dataValidation';
import { getErrorMessage, logError } from '../../../utils/errorHandling';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface OutletFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<Outlet>;
  onSuccess?: (outlet: Outlet) => void;
  onCancel?: () => void;
  territoryId?: string;
}

interface FormValues {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  channel: 'supermarket' | 'convenience' | 'horeca' | 'traditional';
  tier: 'gold' | 'silver' | 'bronze';
  salesVolume?: number;
  nppdScore?: number;
  serviceTime: number;
  assignedTerritory?: string;
}

export const OutletForm: React.FC<OutletFormProps> = ({
  mode,
  initialValues,
  onSuccess,
  onCancel,
  territoryId,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [validationErrors, setValidationErrors] = useState<ValidationResult | null>(null);
  const [coordinateValidation, setCoordinateValidation] = useState<{
    isValid: boolean;
    suggestions?: Array<{ lat: number; lng: number; address: string; confidence: number }>;
  } | null>(null);

  // RTK Query mutations
  const [createOutlet, { isLoading: isCreating }] = useCreateOutletMutation();
  const [updateOutlet, { isLoading: isUpdating }] = useUpdateOutletMutation();
  const [validateCoordinates, { isLoading: isValidatingCoordinates }] = useValidateOutletCoordinatesMutation();

  const isLoading = isCreating || isUpdating;

  // Initialize form with values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name || '',
        address: initialValues.address || '',
        latitude: initialValues.location?.lat || 0,
        longitude: initialValues.location?.lng || 0,
        channel: initialValues.channel || 'traditional',
        tier: initialValues.tier || 'bronze',
        salesVolume: initialValues.salesVolume,
        nppdScore: initialValues.nppdScore,
        serviceTime: initialValues.serviceTime || 15,
        assignedTerritory: initialValues.assignedTerritory || territoryId,
      });
    } else if (territoryId) {
      form.setFieldsValue({
        assignedTerritory: territoryId,
        serviceTime: 15,
        channel: 'traditional',
        tier: 'bronze',
      });
    }
  }, [initialValues, territoryId, form]);

  // Form validation
  const validateForm = (values: FormValues): ValidationResult => {
    const outletData: Partial<Outlet> = {
      name: values.name,
      address: values.address,
      location: {
        lat: values.latitude,
        lng: values.longitude,
      },
      channel: values.channel,
      tier: values.tier,
      salesVolume: values.salesVolume,
      nppdScore: values.nppdScore,
      serviceTime: values.serviceTime,
      assignedTerritory: values.assignedTerritory,
    };

    return validateOutlet(outletData);
  };

  // Handle coordinate validation
  const handleCoordinateValidation = async (address: string, lat?: number, lng?: number) => {
    if (!address.trim()) return;

    try {
      const result = await validateCoordinates({
        address,
        currentCoordinates: lat && lng ? { lat, lng } : undefined,
      }).unwrap();

      setCoordinateValidation({
        isValid: result.data.valid,
        suggestions: result.data.suggestions,
      });
    } catch (error) {
      console.warn('Coordinate validation failed:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    // Validate form data
    const validation = validateForm(values);
    setValidationErrors(validation);

    if (!validation.isValid) {
      message.error('Please fix the validation errors before submitting');
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        message.warning(warning.message);
      });
    }

    const outletData: Partial<Outlet> = {
      name: values.name,
      address: values.address,
      location: {
        lat: values.latitude,
        lng: values.longitude,
      },
      channel: values.channel,
      tier: values.tier,
      salesVolume: values.salesVolume,
      nppdScore: values.nppdScore,
      serviceTime: values.serviceTime,
      assignedTerritory: values.assignedTerritory,
    };

    try {
      let result;
      if (mode === 'create') {
        result = await createOutlet(outletData).unwrap();
      } else {
        result = await updateOutlet({
          id: initialValues!.id!,
          outlet: outletData,
        }).unwrap();
      }

      message.success(`Outlet ${mode === 'create' ? 'created' : 'updated'} successfully`);
      onSuccess?.(result.data);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: `${mode} outlet`,
        entityType: 'outlet',
      });
      message.error(errorMessage);
      logError(error, { operation: `${mode}_outlet` });
    }
  };

  // Handle address change for coordinate validation
  const handleAddressChange = (address: string) => {
    const lat = form.getFieldValue('latitude');
    const lng = form.getFieldValue('longitude');
    handleCoordinateValidation(address, lat, lng);
  };

  // Apply coordinate suggestion
  const applySuggestion = (suggestion: { lat: number; lng: number; address: string }) => {
    form.setFieldsValue({
      latitude: suggestion.lat,
      longitude: suggestion.lng,
      address: suggestion.address,
    });
    setCoordinateValidation(null);
  };

  return (
    <Card
      title={`${mode === 'create' ? 'Create New' : 'Edit'} Outlet`}
      extra={
        <Space>
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            {mode === 'create' ? 'Create' : 'Update'} Outlet
          </Button>
        </Space>
      }
    >
      {/* Validation Errors */}
      {validationErrors && !validationErrors.isValid && (
        <Alert
          message="Validation Errors"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validationErrors.errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Coordinate Validation Suggestions */}
      {coordinateValidation && coordinateValidation.suggestions && (
        <Alert
          message="Coordinate Suggestions"
          description={
            <div>
              <Text>We found better coordinate matches for this address:</Text>
              <div style={{ marginTop: 8 }}>
                {coordinateValidation.suggestions.map((suggestion, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      Use: {suggestion.address} ({suggestion.lat.toFixed(6)}, {suggestion.lng.toFixed(6)})
                      - Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          {/* Basic Information */}
          <Col span={24}>
            <Card title="Basic Information" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Outlet Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Outlet name is required' },
                      { min: 2, message: 'Name must be at least 2 characters' },
                    ]}
                  >
                    <Input placeholder="Enter outlet name" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Channel"
                    name="channel"
                    rules={[{ required: true, message: 'Channel is required' }]}
                  >
                    <Select placeholder="Select channel">
                      <Option value="supermarket">Supermarket</Option>
                      <Option value="convenience">Convenience Store</Option>
                      <Option value="horeca">HoReCa</Option>
                      <Option value="traditional">Traditional Trade</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Tier"
                    name="tier"
                    rules={[{ required: true, message: 'Tier is required' }]}
                  >
                    <Select placeholder="Select tier">
                      <Option value="gold">Gold</Option>
                      <Option value="silver">Silver</Option>
                      <Option value="bronze">Bronze</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Location Information */}
          <Col span={24}>
            <Card title="Location Information" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: 'Address is required' },
                      { min: 10, message: 'Address must be at least 10 characters' },
                    ]}
                  >
                    <TextArea
                      rows={2}
                      placeholder="Enter complete address"
                      onChange={(e) => handleAddressChange(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Latitude
                        <Tooltip title="Latitude coordinate (-90 to 90)">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="latitude"
                    rules={[
                      { required: true, message: 'Latitude is required' },
                      { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90' },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.000000"
                      precision={6}
                      step={0.000001}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Longitude
                        <Tooltip title="Longitude coordinate (-180 to 180)">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="longitude"
                    rules={[
                      { required: true, message: 'Longitude is required' },
                      { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180' },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.000000"
                      precision={6}
                      step={0.000001}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Button
                    type="dashed"
                    icon={<EnvironmentOutlined />}
                    loading={isValidatingCoordinates}
                    onClick={() => {
                      const address = form.getFieldValue('address');
                      const lat = form.getFieldValue('latitude');
                      const lng = form.getFieldValue('longitude');
                      handleCoordinateValidation(address, lat, lng);
                    }}
                  >
                    Validate Coordinates
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Business Information */}
          <Col span={24}>
            <Card title="Business Information" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={
                      <Space>
                        Sales Volume
                        <Tooltip title="Annual sales volume in USD">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="salesVolume"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0"
                      min={0}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <Space>
                        NPPD Score
                        <Tooltip title="Next Product Purchase Date score (0-100%)">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="nppdScore"
                    rules={[
                      { type: 'number', min: 0, max: 100, message: 'NPPD Score must be between 0 and 100' },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0"
                      min={0}
                      max={100}
                      precision={1}
                      formatter={(value) => `${value}%`}
                      parser={(value) => Number(value!.replace('%', ''))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <Space>
                        Service Time
                        <Tooltip title="Average service time in minutes">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="serviceTime"
                    rules={[
                      { required: true, message: 'Service time is required' },
                      { type: 'number', min: 1, max: 480, message: 'Service time must be between 1 and 480 minutes' },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="15"
                      min={1}
                      max={480}
                      formatter={(value) => `${value} min`}
                      parser={(value) => Number(value!.replace(' min', ''))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Assignment Information */}
          <Col span={24}>
            <Card title="Assignment Information" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Assigned Territory"
                    name="assignedTerritory"
                  >
                    <Select
                      placeholder="Select territory (optional)"
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {/* Territory options would be loaded from API */}
                      <Option value="territory-1">North Territory</Option>
                      <Option value="territory-2">South Territory</Option>
                      <Option value="territory-3">East Territory</Option>
                      <Option value="territory-4">West Territory</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div style={{ paddingTop: 30 }}>
                    <Text type="secondary">
                      Territory assignment can be changed later through the territory management interface.
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Form Actions */}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel} disabled={isLoading}>
                <CloseOutlined /> Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isLoading}
              >
                {mode === 'create' ? 'Create' : 'Update'} Outlet
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default OutletForm;
