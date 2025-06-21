import React, { useState, useCallback } from 'react';
import {
  Modal,
  Steps,
  Upload,
  Button,
  Table,
  Alert,
  Progress,
  Typography,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Checkbox,
  message,
} from 'antd';
import {
  InboxOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import {
  useImportOutletsMutation,
  useGetImportSessionQuery,
} from '../../../store';
import type { ImportRequest } from '../../../types';
import { validateOutletBatch } from '../../../utils/dataValidation';
import { getErrorMessage, logError } from '../../../utils/errorHandling';

const { Step } = Steps;
const { Dragger } = Upload;
const { Title, Text } = Typography;

interface ImportWizardProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (importedCount: number) => void;
  territoryId?: string;
}

interface ParsedOutlet {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  channel: 'supermarket' | 'convenience' | 'horeca' | 'traditional';
  tier: 'gold' | 'silver' | 'bronze';
  salesVolume?: number;
  nppdScore?: number;
  serviceTime: number;
}

interface ValidationSummary {
  total: number;
  valid: number;
  invalid: number;
  warnings: number;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [parsedData, setParsedData] = useState<ParsedOutlet[]>([]);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    validateCoordinates: true,
  });
  const [activeImportSession, setActiveImportSession] = useState<string | null>(null);

  // RTK Query hooks
  const [importOutlets, { isLoading: isImporting }] = useImportOutletsMutation();
  const {
    data: importSessionData,
  } = useGetImportSessionQuery(activeImportSession!, {
    skip: !activeImportSession,
    pollingInterval: 2000, // Poll every 2 seconds
  });

  const importSession = importSessionData?.data;

  // Reset wizard state
  const resetWizard = useCallback(() => {
    setCurrentStep(0);
    setUploadedFile(null);
    setParsedData([]);
    setValidationSummary(null);
    setValidationResults([]);
    setActiveImportSession(null);
  }, []);

  // Handle file upload
  const handleFileUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      // Simulate file parsing (in real implementation, this would parse CSV/Excel)
      const mockData: ParsedOutlet[] = [
        {
          name: 'Sample Outlet 1',
          address: '123 Main St, City, Country',
          latitude: 40.7128,
          longitude: -74.0060,
          channel: 'supermarket',
          tier: 'gold',
          salesVolume: 150000,
          nppdScore: 85.5,
          serviceTime: 20,
        },
        {
          name: 'Sample Outlet 2',
          address: '456 Oak Ave, City, Country',
          latitude: 40.7589,
          longitude: -73.9851,
          channel: 'convenience',
          tier: 'silver',
          salesVolume: 75000,
          nppdScore: 72.3,
          serviceTime: 15,
        },
        // Add more sample data...
      ];

      setParsedData(mockData);
      setUploadedFile(file as UploadFile);
      
      // Validate the parsed data
      const outletData = mockData.map(item => ({
        ...item,
        location: { lat: item.latitude, lng: item.longitude },
      }));
      const { validOutlets, invalidOutlets } = validateOutletBatch(outletData);
      
      const summary: ValidationSummary = {
        total: mockData.length,
        valid: validOutlets.length,
        invalid: invalidOutlets.length,
        warnings: 0, // Count warnings separately
      };

      setValidationSummary(summary);
      setValidationResults(invalidOutlets);
      
      onSuccess?.('ok');
      setCurrentStep(1);
    } catch (error) {
      onError?.(error as Error);
      message.error('Failed to parse file');
    }
  };

  // Handle import execution
  const handleImport = async () => {
    if (!uploadedFile || !parsedData.length) return;

    try {
      const importRequest: ImportRequest = {
        file: uploadedFile.originFileObj as File,
        type: 'outlets',
        options: importOptions,
      };

      const result = await importOutlets(importRequest).unwrap();
      setActiveImportSession(result.data.id);
      setCurrentStep(2);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, {
        operation: 'import outlets',
        entityType: 'outlets',
      });
      message.error(errorMessage);
      logError(error, { operation: 'import_outlets' });
    }
  };

  // Handle wizard completion
  const handleComplete = () => {
    if (importSession?.status === 'completed') {
      onSuccess?.(importSession.processedRecords);
      message.success(`Successfully imported ${importSession.processedRecords} outlets`);
    }
    resetWizard();
    onClose();
  };

  // Download sample template
  const downloadTemplate = () => {
    const csvContent = `name,address,latitude,longitude,channel,tier,salesVolume,nppdScore,serviceTime
Sample Outlet,123 Main St,40.7128,-74.0060,supermarket,gold,150000,85.5,20
Another Outlet,456 Oak Ave,40.7589,-73.9851,convenience,silver,75000,72.3,15`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outlet_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Validation results table columns
  const validationColumns = [
    {
      title: 'Row',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (index: number) => index + 1,
    },
    {
      title: 'Outlet Name',
      dataIndex: ['outlet', 'name'],
      key: 'name',
    },
    {
      title: 'Errors',
      dataIndex: ['validation', 'errors'],
      key: 'errors',
      render: (errors: any[]) => (
        <div>
          {errors.map((error, index) => (
            <Tag key={index} color="red" style={{ marginBottom: 4 }}>
              {error.message}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  // Step content
  const stepContent = [
    // Step 1: File Upload
    <div key="upload">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4}>Upload Outlet Data</Title>
          <Text type="secondary">
            Upload a CSV or Excel file containing outlet information
          </Text>
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
              block
            >
              Download Template
            </Button>
          </Col>
          <Col span={12}>
            <Text type="secondary">
              Download the template to see the required format
            </Text>
          </Col>
        </Row>

        <Dragger
          name="file"
          multiple={false}
          accept=".csv,.xlsx,.xls"
          customRequest={handleFileUpload}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for CSV and Excel files. Maximum file size: 10MB
          </p>
        </Dragger>

        {uploadedFile && (
          <Alert
            message="File uploaded successfully"
            description={`${uploadedFile.name} - ${parsedData.length} records found`}
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </div>,

    // Step 2: Validation & Preview
    <div key="validation">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4}>Data Validation</Title>
          <Text type="secondary">
            Review the validation results before importing
          </Text>
        </div>

        {validationSummary && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic
                title="Total Records"
                value={validationSummary.total}
                prefix={<FileExcelOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Valid Records"
                value={validationSummary.valid}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Invalid Records"
                value={validationSummary.invalid}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Warnings"
                value={validationSummary.warnings}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#d48806' }}
              />
            </Col>
          </Row>
        )}

        {validationResults.length > 0 && (
          <div>
            <Alert
              message="Validation Errors Found"
              description="The following records have validation errors and will be skipped during import."
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={validationColumns}
              dataSource={validationResults}
              rowKey="index"
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Title level={5}>Import Options</Title>
          <Space direction="vertical">
            <Checkbox
              checked={importOptions.skipDuplicates}
              onChange={(e) => setImportOptions(prev => ({ ...prev, skipDuplicates: e.target.checked }))}
            >
              Skip duplicate outlets (based on name and address)
            </Checkbox>
            <Checkbox
              checked={importOptions.updateExisting}
              onChange={(e) => setImportOptions(prev => ({ ...prev, updateExisting: e.target.checked }))}
            >
              Update existing outlets with new data
            </Checkbox>
            <Checkbox
              checked={importOptions.validateCoordinates}
              onChange={(e) => setImportOptions(prev => ({ ...prev, validateCoordinates: e.target.checked }))}
            >
              Validate coordinates against address
            </Checkbox>
          </Space>
        </div>
      </Card>
    </div>,

    // Step 3: Import Progress
    <div key="progress">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4}>Import Progress</Title>
          <Text type="secondary">
            Importing outlet data...
          </Text>
        </div>

        {importSession && (
          <div>
            <Progress
              percent={Math.round((importSession.processedRecords / importSession.totalRecords) * 100)}
              status={importSession.status === 'failed' ? 'exception' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Statistic
                  title="Total Records"
                  value={importSession.totalRecords}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Processed"
                  value={importSession.processedRecords}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Failed"
                  value={importSession.failedRecords}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>

            {importSession.status === 'completed' && (
              <Alert
                message="Import Completed Successfully"
                description={`${importSession.processedRecords} outlets have been imported successfully.`}
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {importSession.status === 'failed' && (
              <Alert
                message="Import Failed"
                description="The import process encountered errors. Please check the error details and try again."
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {importSession.errors && importSession.errors.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Error Details</Title>
                <ul>
                  {importSession.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>,
  ];

  return (
    <Modal
      title="Import Outlets"
      open={visible}
      onCancel={() => {
        resetWizard();
        onClose();
      }}
      width={800}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => {
              resetWizard();
              onClose();
            }}>
              Cancel
            </Button>
            {currentStep > 0 && currentStep < 2 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={handleImport}
                loading={isImporting}
                disabled={!validationSummary || validationSummary.valid === 0}
              >
                Start Import
              </Button>
            )}
            {currentStep === 2 && importSession?.status === 'completed' && (
              <Button type="primary" onClick={handleComplete}>
                Complete
              </Button>
            )}
          </Space>
        </div>
      }
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Upload File" icon={<InboxOutlined />} />
        <Step title="Validate Data" icon={<CheckCircleOutlined />} />
        <Step title="Import Progress" icon={<UploadOutlined />} />
      </Steps>

      {stepContent[currentStep]}
    </Modal>
  );
};

export default ImportWizard;
