import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  message,
  Tag,
  Row,
  Col,
  DatePicker,
  Select,
  Descriptions,
  Modal
} from 'antd';
import {
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { monitorAPI } from '../../services/api';
import moment from 'moment';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const OperationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await monitorAPI.getOperationLogs();
      if (response.data.code === 200) {
        setLogs(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch operation logs');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedLog(record);
    setDetailVisible(true);
  };

  const handleExport = async () => {
    try {
      const response = await monitorAPI.exportOperationLogs();
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'operation_logs.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Export successful');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const getStatusColor = (status) => {
    return status === 0 ? 'green' : 'red';
  };

  const getStatusText = (status) => {
    return status === 0 ? 'Success' : 'Failed';
  };

  const getOperTypeColor = (operType) => {
    const colors = {
      '1': 'blue',    // Insert
      '2': 'green',   // Update
      '3': 'red',     // Delete
      '4': 'orange',  // Grant
      '5': 'purple',  // Export
      '6': 'cyan',    // Import
      '7': 'gold',    // Force logout
      '8': 'lime',    // Generate code
      '9': 'magenta', // Clear data
    };
    return colors[operType] || 'default';
  };

  const getOperTypeText = (operType) => {
    const types = {
      '1': 'Insert',
      '2': 'Update', 
      '3': 'Delete',
      '4': 'Grant',
      '5': 'Export',
      '6': 'Import',
      '7': 'Force Logout',
      '8': 'Generate Code',
      '9': 'Clear Data',
    };
    return types[operType] || 'Other';
  };

  // Sample data for demo
  const sampleLogs = [
    {
      operId: 1,
      title: 'User Management',
      businessType: '2',
      method: 'com.a.map.controller.system.SysUserController.edit()',
      requestMethod: 'PUT',
      operatorType: '1',
      operName: 'admin',
      deptName: 'IT Department',
      operUrl: '/system/user',
      operIp: '192.168.1.100',
      operLocation: 'Internal Network',
      operParam: '{"userId":1,"userName":"admin","status":"0"}',
      jsonResult: '{"code":200,"msg":"success"}',
      status: 0,
      errorMsg: '',
      operTime: '2025-01-24 15:30:25',
      costTime: 156
    },
    {
      operId: 2,
      title: 'Role Management',
      businessType: '1',
      method: 'com.a.map.controller.system.SysRoleController.add()',
      requestMethod: 'POST',
      operatorType: '1',
      operName: 'admin',
      deptName: 'IT Department',
      operUrl: '/system/role',
      operIp: '192.168.1.100',
      operLocation: 'Internal Network',
      operParam: '{"roleName":"Test Role","roleKey":"test"}',
      jsonResult: '{"code":200,"msg":"success"}',
      status: 0,
      errorMsg: '',
      operTime: '2025-01-24 15:25:10',
      costTime: 89
    }
  ];

  const filteredLogs = (logs.length > 0 ? logs : sampleLogs).filter(log => {
    if (!searchValue) return true;
    return (
      log.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.operName.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.operIp.includes(searchValue)
    );
  });

  const columns = [
    {
      title: 'Operation ID',
      dataIndex: 'operId',
      key: 'operId',
      width: 100,
    },
    {
      title: 'System Module',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Operation Type',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type) => (
        <Tag color={getOperTypeColor(type)}>
          {getOperTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Operator',
      dataIndex: 'operName',
      key: 'operName',
    },
    {
      title: 'Department',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text) => text || '-',
    },
    {
      title: 'IP Address',
      dataIndex: 'operIp',
      key: 'operIp',
    },
    {
      title: 'Location',
      dataIndex: 'operLocation',
      key: 'operLocation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Operation Time',
      dataIndex: 'operTime',
      key: 'operTime',
      width: 180,
      sorter: (a, b) => moment(a.operTime).unix() - moment(b.operTime).unix(),
    },
    {
      title: 'Cost Time',
      dataIndex: 'costTime',
      key: 'costTime',
      render: (time) => `${time}ms`,
      sorter: (a, b) => a.costTime - b.costTime,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="Operation Logs" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search by module, operator, or IP"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchLogs}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="operId"
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

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          title="Operation Log Details"
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Close
            </Button>
          ]}
          width={800}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Operation ID">{selectedLog.operId}</Descriptions.Item>
            <Descriptions.Item label="System Module">{selectedLog.title}</Descriptions.Item>
            <Descriptions.Item label="Operation Type">
              <Tag color={getOperTypeColor(selectedLog.businessType)}>
                {getOperTypeText(selectedLog.businessType)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Request Method">
              <Tag color="blue">{selectedLog.requestMethod}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Operator">{selectedLog.operName}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedLog.deptName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Request URL" span={2}>
              <code>{selectedLog.operUrl}</code>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedLog.operIp}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedLog.operLocation}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedLog.status)}>
                {getStatusText(selectedLog.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Cost Time">{selectedLog.costTime}ms</Descriptions.Item>
            <Descriptions.Item label="Operation Time" span={2}>
              {selectedLog.operTime}
            </Descriptions.Item>
            <Descriptions.Item label="Method Name" span={2}>
              <code style={{ fontSize: '12px' }}>{selectedLog.method}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Request Parameters" span={2}>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px',
                fontSize: '12px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {JSON.stringify(JSON.parse(selectedLog.operParam || '{}'), null, 2)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label="Response Result" span={2}>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px',
                fontSize: '12px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {JSON.stringify(JSON.parse(selectedLog.jsonResult || '{}'), null, 2)}
              </pre>
            </Descriptions.Item>
            {selectedLog.errorMsg && (
              <Descriptions.Item label="Error Message" span={2}>
                <div style={{ color: 'red' }}>{selectedLog.errorMsg}</div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default OperationLogs;
