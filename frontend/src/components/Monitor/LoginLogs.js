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
  Modal,
  Descriptions
} from 'antd';
import {
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { monitorAPI } from '../../services/api';
import moment from 'moment';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const LoginLogs = () => {
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
      const response = await monitorAPI.getLoginLogs();
      if (response.data.code === 200) {
        setLogs(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch login logs');
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
      const response = await monitorAPI.exportLoginLogs();
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'login_logs.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Export successful');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const getStatusColor = (status) => {
    return status === '0' ? 'green' : 'red';
  };

  const getStatusText = (status) => {
    return status === '0' ? 'Success' : 'Failed';
  };

  // Sample data for demo
  const sampleLogs = [
    {
      infoId: 1,
      userName: 'admin',
      ipaddr: '192.168.1.100',
      loginLocation: 'Internal Network',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 10',
      status: '0',
      msg: 'Login successful',
      loginTime: '2025-01-24 15:30:25'
    },
    {
      infoId: 2,
      userName: 'user001',
      ipaddr: '192.168.1.101',
      loginLocation: 'Internal Network',
      browser: 'Firefox 121.0',
      os: 'macOS',
      status: '0',
      msg: 'Login successful',
      loginTime: '2025-01-24 15:25:10'
    },
    {
      infoId: 3,
      userName: 'test',
      ipaddr: '192.168.1.102',
      loginLocation: 'Internal Network',
      browser: 'Safari 17.2',
      os: 'macOS',
      status: '1',
      msg: 'Invalid username or password',
      loginTime: '2025-01-24 15:20:45'
    },
    {
      infoId: 4,
      userName: 'admin',
      ipaddr: '192.168.1.100',
      loginLocation: 'Internal Network',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 10',
      status: '0',
      msg: 'Logout successful',
      loginTime: '2025-01-24 14:45:30'
    }
  ];

  const filteredLogs = (logs.length > 0 ? logs : sampleLogs).filter(log => {
    if (!searchValue) return true;
    return (
      log.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.ipaddr.includes(searchValue) ||
      log.loginLocation.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Log ID',
      dataIndex: 'infoId',
      key: 'infoId',
      width: 100,
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipaddr',
      key: 'ipaddr',
    },
    {
      title: 'Login Location',
      dataIndex: 'loginLocation',
      key: 'loginLocation',
    },
    {
      title: 'Browser',
      dataIndex: 'browser',
      key: 'browser',
      ellipsis: true,
    },
    {
      title: 'Operating System',
      dataIndex: 'os',
      key: 'os',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={<LoginOutlined />}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Login Time',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 180,
      sorter: (a, b) => moment(a.loginTime).unix() - moment(b.loginTime).unix(),
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
      <Card title="Login Logs" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search by username, IP, or location"
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
          rowKey="infoId"
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
          title="Login Log Details"
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Log ID">
              {selectedLog.infoId}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                {selectedLog.userName}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {selectedLog.ipaddr}
            </Descriptions.Item>
            <Descriptions.Item label="Login Location">
              {selectedLog.loginLocation}
            </Descriptions.Item>
            <Descriptions.Item label="Browser">
              {selectedLog.browser}
            </Descriptions.Item>
            <Descriptions.Item label="Operating System">
              {selectedLog.os}
            </Descriptions.Item>
            <Descriptions.Item label="Login Status">
              <Tag color={getStatusColor(selectedLog.status)} icon={<LoginOutlined />}>
                {getStatusText(selectedLog.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Login Time">
              {selectedLog.loginTime}
            </Descriptions.Item>
            <Descriptions.Item label="Message">
              <div style={{ 
                color: selectedLog.status === '0' ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold'
              }}>
                {selectedLog.msg}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default LoginLogs;
