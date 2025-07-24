import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  ReloadOutlined,
  UserDeleteOutlined,
  SearchOutlined,
  UserOutlined,
  LaptopOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { monitorAPI } from '../../services/api';

const { Search } = Input;

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    fetchOnlineUsers();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, [searchParams]);

  const fetchOnlineUsers = async () => {
    setLoading(true);
    try {
      const response = await monitorAPI.getOnlineUsers(searchParams);
      if (response.data.code === 200) {
        setOnlineUsers(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch online users');
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = async (tokenId) => {
    try {
      const response = await monitorAPI.forceLogout(tokenId);
      if (response.data.code === 200) {
        message.success('User logged out successfully');
        fetchOnlineUsers();
      } else {
        message.error(response.data.msg || 'Failed to logout user');
      }
    } catch (error) {
      message.error('Failed to logout user');
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ userName: value });
  };

  const columns = [
    {
      title: 'Session ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipaddr',
      key: 'ipaddr',
      render: (text) => (
        <Space>
          <GlobalOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'loginLocation',
      key: 'loginLocation',
    },
    {
      title: 'Browser',
      dataIndex: 'browser',
      key: 'browser',
      render: (text) => (
        <Space>
          <LaptopOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'OS',
      dataIndex: 'os',
      key: 'os',
    },
    {
      title: 'Login Time',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 180,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Tag color="green">Online</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Force Logout"
          description="Are you sure you want to force this user to logout?"
          onConfirm={() => handleForceLogout(record.tokenId)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="link" 
            danger 
            icon={<UserDeleteOutlined />}
            size="small"
          >
            Force Logout
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const statisticsData = [
    {
      title: 'Total Online',
      value: onlineUsers.length,
      icon: <UserOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Unique IPs',
      value: new Set(onlineUsers.map(user => user.ipaddr)).size,
      icon: <GlobalOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Active Sessions',
      value: onlineUsers.filter(user => user.status === 'online').length,
      icon: <LaptopOutlined />,
      color: '#faad14',
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsData.map((stat, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search by username"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchOnlineUsers}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Online Users Table */}
      <Card title={`Online Users (${onlineUsers.length})`}>
        <Table
          columns={columns}
          dataSource={onlineUsers}
          rowKey="tokenId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default OnlineUsers;
