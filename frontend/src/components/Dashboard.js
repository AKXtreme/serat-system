import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Statistic, Typography, message, Space, Dropdown } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, systemAPI, monitorAPI } from '../services/api';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    operationLogs: 0,
    loginRecords: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchDashboardStats();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await authAPI.getUserInfo();
      if (response.data.code === 200) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      message.error('Failed to load user information');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users using existing system API
      const usersResponse = await systemAPI.getUsers({});
      const totalUsers = usersResponse.data.total || 0;

      // Fetch active sessions using existing monitor API
      const onlineResponse = await monitorAPI.getOnlineUsers({});
      const activeSessions = onlineResponse.data.total || 0;

      // Fetch operation logs using existing monitor API
      const operLogResponse = await monitorAPI.getOperationLogs({});
      const operationLogs = operLogResponse.data.total || 0;

      // Fetch login logs using existing monitor API
      const loginLogResponse = await monitorAPI.getLoginLogs({});
      const loginRecords = loginLogResponse.data.total || 0;

      setDashboardStats({
        totalUsers,
        activeSessions,
        operationLogs,
        loginRecords
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set default values if API calls fail
      setDashboardStats({
        totalUsers: 0,
        activeSessions: 0,
        operationLogs: 0,
        loginRecords: 0
      });
      message.error('Failed to load some dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      message.error('Logout failed');
    }
  };

  // Navigation handlers
  const handleManageUsers = () => {
    navigate('/system/users');
  };

  const handleSystemConfig = () => {
    navigate('/system/config');
  };

  const handleViewReports = () => {
    navigate('/monitor/logs/operation');
  };

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/system/profile');
        break;
      case 'settings':
        navigate('/system/config');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <DashboardOutlined style={{ marginRight: 8 }} />
          Serat Dashboard
        </div>
        
        <Space>
          <Text>Welcome, {userInfo?.user?.userName || 'User'}</Text>
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
        </Space>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Card */}
        <Card className="welcome-card">
          <Title level={2}>Welcome to Serat Dashboard</Title>
          <Text type="secondary">
            Manage your enterprise system with ease. Here's an overview of your system status.
          </Text>
        </Card>

        {/* Statistics Grid */}
        {/* Statistics Grid */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Total Users"
              value={dashboardStats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
              loading={loading}
            />
          </Card>
          
          <Card className="stat-card">
            <Statistic
              title="Active Sessions"
              value={dashboardStats.activeSessions}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              loading={loading}
            />
          </Card>
          
          <Card className="stat-card">
            <Statistic
              title="Operation Logs"
              value={dashboardStats.operationLogs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
              loading={loading}
            />
          </Card>
          
          <Card className="stat-card">
            <Statistic
              title="Login Records"
              value={dashboardStats.loginRecords}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#f5222d' }}
              loading={loading}
            />
          </Card>
        </div>        {/* Feature Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card title="User Management" extra={<UserOutlined />}>
              <p>Manage users, roles, and permissions in your system.</p>
              <Button type="primary" block onClick={handleManageUsers}>
                Manage Users
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card title="System Settings" extra={<SettingOutlined />}>
              <p>Configure system parameters and application settings.</p>
              <Button type="primary" block onClick={handleSystemConfig}>
                System Config
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card title="Reports & Analytics" extra={<BarChartOutlined />}>
              <p>View system reports and analytical data.</p>
              <Button type="primary" block onClick={handleViewReports}>
                View Reports
              </Button>
            </Card>
          </Col>
        </Row>

        {/* System Information */}
        <Card title="System Information" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Application Version:</Text>
              <br />
              <Text>v1.0.0</Text>
            </Col>
            <Col span={8}>
              <Text strong>Server Status:</Text>
              <br />
              <Text style={{ color: '#52c41a' }}>● Online</Text>
            </Col>
            <Col span={8}>
              <Text strong>Last Login:</Text>
              <br />
              <Text>{new Date().toLocaleString()}</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
