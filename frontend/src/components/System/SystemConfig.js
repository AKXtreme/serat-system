import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Select,
  Switch,
  Tabs,
  Descriptions,
  Upload
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const SystemConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getConfigs();
      if (response.data.code === 200) {
        setConfigs(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch system configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedConfig(null);
    form.resetFields();
    form.setFieldsValue({
      configType: 'Y',
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedConfig(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedConfig(record);
    setDetailModalVisible(true);
  };

  const handleDelete = async (configId) => {
    try {
      const response = await systemAPI.deleteConfig(configId);
      if (response.data.code === 200) {
        message.success('Configuration deleted successfully');
        fetchConfigs();
      } else {
        message.error(response.data.msg || 'Failed to delete configuration');
      }
    } catch (error) {
      message.error('Failed to delete configuration');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const configData = {
        ...values,
        configId: modalType === 'edit' ? selectedConfig.configId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createConfig(configData);
      } else {
        response = await systemAPI.updateConfig(configData);
      }

      if (response.data.code === 200) {
        message.success(`Configuration ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchConfigs();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} configuration`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} configuration`);
    }
  };

  const handleRefreshCache = async () => {
    try {
      const response = await systemAPI.refreshConfigCache();
      if (response.data.code === 200) {
        message.success('Configuration cache refreshed successfully');
      } else {
        message.error(response.data.msg || 'Failed to refresh cache');
      }
    } catch (error) {
      message.error('Failed to refresh cache');
    }
  };

  const handleExport = async () => {
    try {
      const response = await systemAPI.exportConfigs();
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'system_config.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Export successful');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/system/config/importData',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        fetchConfigs();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getConfigTypeText = (configType) => {
    return configType === 'Y' ? 'Built-in' : 'Custom';
  };

  const getConfigTypeColor = (configType) => {
    return configType === 'Y' ? 'blue' : 'green';
  };

  const filteredConfigs = configs.filter(config => {
    const matchesSearch = !searchValue || 
      config.configName.toLowerCase().includes(searchValue.toLowerCase()) ||
      config.configKey.toLowerCase().includes(searchValue.toLowerCase()) ||
      config.configValue.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'builtin' && config.configType === 'Y') ||
      (activeTab === 'custom' && config.configType === 'N');

    return matchesSearch && matchesTab;
  });

  const columns = [
    {
      title: 'Config ID',
      dataIndex: 'configId',
      key: 'configId',
      width: 100,
    },
    {
      title: 'Config Name',
      dataIndex: 'configName',
      key: 'configName',
      render: (text) => (
        <Space>
          <SettingOutlined style={{ color: '#1890ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Config Key',
      dataIndex: 'configKey',
      key: 'configKey',
      render: (text) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'Config Value',
      dataIndex: 'configValue',
      key: 'configValue',
      ellipsis: true,
      width: 200,
      render: (text) => (
        <div style={{ 
          maxWidth: 180, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'configType',
      key: 'configType',
      render: (configType) => (
        <Tag color={getConfigTypeColor(configType)}>
          {getConfigTypeText(configType)}
        </Tag>
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          {record.configType !== 'Y' && (
            <Popconfirm
              title="Delete Configuration"
              description="Are you sure you want to delete this configuration?"
              onConfirm={() => handleDelete(record.configId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="System Configuration" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search configurations"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Configuration
              </Button>
              <Button
                icon={<SaveOutlined />}
                onClick={handleRefreshCache}
              >
                Refresh Cache
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>
                  Import
                </Button>
              </Upload>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchConfigs}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
          <TabPane tab="All Configurations" key="all" />
          <TabPane tab="Built-in Configurations" key="builtin" />
          <TabPane tab="Custom Configurations" key="custom" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredConfigs}
          rowKey="configId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      {/* Configuration Modal */}
      <Modal
        title={modalType === 'add' ? 'Add Configuration' : 'Edit Configuration'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            configType: 'Y',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="configName"
                label="Configuration Name"
                rules={[
                  { required: true, message: 'Please input configuration name!' },
                  { min: 2, max: 100, message: 'Configuration name must be 2-100 characters!' },
                ]}
              >
                <Input placeholder="Enter configuration name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="configKey"
                label="Configuration Key"
                rules={[
                  { required: true, message: 'Please input configuration key!' },
                  { min: 2, max: 100, message: 'Configuration key must be 2-100 characters!' },
                  { pattern: /^[a-zA-Z0-9._-]+$/, message: 'Configuration key can only contain letters, numbers, dots, hyphens, and underscores!' },
                ]}
              >
                <Input placeholder="Enter configuration key" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="configValue"
                label="Configuration Value"
                rules={[
                  { required: true, message: 'Please input configuration value!' },
                  { max: 500, message: 'Configuration value cannot exceed 500 characters!' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter configuration value"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="configType"
                label="Configuration Type"
              >
                <Select disabled={modalType === 'edit' && selectedConfig?.configType === 'Y'}>
                  <Option value="Y">Built-in</Option>
                  <Option value="N">Custom</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="Remark"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter remark (optional)"
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Configuration Detail Modal */}
      <Modal
        title="Configuration Details"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setDetailModalVisible(false);
            handleEdit(selectedConfig);
          }}>
            Edit
          </Button>,
        ]}
        width={700}
      >
        {selectedConfig && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Configuration ID">
              {selectedConfig.configId}
            </Descriptions.Item>
            <Descriptions.Item label="Configuration Name">
              {selectedConfig.configName}
            </Descriptions.Item>
            <Descriptions.Item label="Configuration Key">
              <Tag color="cyan">{selectedConfig.configKey}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Configuration Value">
              <div style={{ 
                maxHeight: 200, 
                overflow: 'auto',
                padding: '8px',
                background: '#f5f5f5',
                borderRadius: '4px',
                wordBreak: 'break-all'
              }}>
                {selectedConfig.configValue}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Configuration Type">
              <Tag color={getConfigTypeColor(selectedConfig.configType)}>
                {getConfigTypeText(selectedConfig.configType)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Create Time">
              {selectedConfig.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="Update Time">
              {selectedConfig.updateTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Create By">
              {selectedConfig.createBy || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Update By">
              {selectedConfig.updateBy || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Remark">
              {selectedConfig.remark || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SystemConfig;
