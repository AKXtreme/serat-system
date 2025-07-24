import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, message } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  MonitorOutlined,
  FileTextOutlined,
  ToolOutlined,
  BellOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
    } catch (error) {
      message.error('Logout failed');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/system/profile">Profile</Link>,
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
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: 'System Management',
      children: [
        {
          key: '/system/users',
          icon: <UserOutlined />,
          label: <Link to="/system/users">User Management</Link>,
        },
        {
          key: '/system/roles',
          icon: <SafetyCertificateOutlined />,
          label: <Link to="/system/roles">Role Management</Link>,
        },
        {
          key: '/system/menus',
          icon: <BookOutlined />,
          label: <Link to="/system/menus">Menu Management</Link>,
        },
        {
          key: '/system/departments',
          icon: <BankOutlined />,
          label: <Link to="/system/departments">Department Management</Link>,
        },
        {
          key: '/system/positions',
          icon: <TeamOutlined />,
          label: <Link to="/system/positions">Position Management</Link>,
        },
        {
          key: '/system/dictionary',
          icon: <BookOutlined />,
          label: <Link to="/system/dictionary">Dictionary Management</Link>,
        },
        {
          key: '/system/config',
          icon: <ToolOutlined />,
          label: <Link to="/system/config">System Configuration</Link>,
        },
        {
          key: '/system/notices',
          icon: <BellOutlined />,
          label: <Link to="/system/notices">Notice Management</Link>,
        },
      ],
    },
    {
      key: 'monitor',
      icon: <MonitorOutlined />,
      label: 'System Monitoring',
      children: [
        {
          key: '/monitor/online',
          icon: <UserOutlined />,
          label: <Link to="/monitor/online">Online Users</Link>,
        },
        {
          key: '/monitor/server',
          icon: <MonitorOutlined />,
          label: <Link to="/monitor/server">Server Monitoring</Link>,
        },
        {
          key: '/monitor/cache',
          icon: <ToolOutlined />,
          label: <Link to="/monitor/cache">Cache Monitoring</Link>,
        },
        {
          key: '/monitor/logs',
          icon: <FileTextOutlined />,
          label: 'Log Management',
          children: [
            {
              key: '/monitor/logs/operation',
              icon: <FileTextOutlined />,
              label: <Link to="/monitor/logs/operation">Operation Logs</Link>,
            },
            {
              key: '/monitor/logs/login',
              icon: <FileTextOutlined />,
              label: <Link to="/monitor/logs/login">Login Logs</Link>,
            },
          ],
        },
      ],
    },
  ];

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const getOpenKeys = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/system/')) return ['system'];
    if (pathname.startsWith('/monitor/')) return ['monitor'];
    if (pathname.startsWith('/monitor/logs/')) return ['monitor', '/monitor/logs'];
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
      >
        <div className="logo">
          <DashboardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          {!collapsed && <span style={{ marginLeft: 12, color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Serat System</span>}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Header className="layout-header">
          <div className="header-content">
            <div className="header-title">
              <Text strong style={{ fontSize: '16px' }}>Serat Management System</Text>
            </div>
            
            <Space>
              <Text>Welcome, {user?.user?.nickName || user?.user?.userName || 'User'}</Text>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} />
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="layout-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
