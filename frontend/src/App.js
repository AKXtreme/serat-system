import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MainLayout from './components/Layout/MainLayout';
import UserManagement from './components/System/UserManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Lazy load components for better performance
const RoleManagement = React.lazy(() => import('./components/System/RoleManagement'));
const MenuManagement = React.lazy(() => import('./components/System/MenuManagement'));
const DepartmentManagement = React.lazy(() => import('./components/System/DepartmentManagement'));
const PositionManagement = React.lazy(() => import('./components/System/PositionManagement'));
const DictionaryManagement = React.lazy(() => import('./components/System/DictionaryManagement'));
const SystemConfig = React.lazy(() => import('./components/System/SystemConfig'));
const NoticeManagement = React.lazy(() => import('./components/System/NoticeManagement'));
const UserProfile = React.lazy(() => import('./components/System/UserProfile'));
const OnlineUsers = React.lazy(() => import('./components/Monitor/OnlineUsers'));
const ServerMonitoring = React.lazy(() => import('./components/Monitor/ServerMonitoring'));
const CacheMonitoring = React.lazy(() => import('./components/Monitor/CacheMonitoring'));
const OperationLogs = React.lazy(() => import('./components/Monitor/OperationLogs'));
const LoginLogs = React.lazy(() => import('./components/Monitor/LoginLogs'));

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
};

const AppContent = () => {
  // Define ProtectedRoute inside AuthProvider context
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* System Management Routes */}
                <Route path="system/users" element={<UserManagement />} />
                <Route path="system/roles" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <RoleManagement />
                  </React.Suspense>
                } />
                <Route path="system/menus" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <MenuManagement />
                  </React.Suspense>
                } />
                <Route path="system/departments" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DepartmentManagement />
                  </React.Suspense>
                } />
                <Route path="system/positions" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <PositionManagement />
                  </React.Suspense>
                } />
                <Route path="system/dictionary" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DictionaryManagement />
                  </React.Suspense>
                } />
                <Route path="system/config" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <SystemConfig />
                  </React.Suspense>
                } />
                <Route path="system/notices" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <NoticeManagement />
                  </React.Suspense>
                } />
                <Route path="system/profile" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <UserProfile />
                  </React.Suspense>
                } />
                
                {/* Monitor Routes */}
                <Route path="monitor/online" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <OnlineUsers />
                  </React.Suspense>
                } />
                <Route path="monitor/server" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <ServerMonitoring />
                  </React.Suspense>
                } />
                <Route path="monitor/cache" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CacheMonitoring />
                  </React.Suspense>
                } />
                <Route path="monitor/logs/operation" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <OperationLogs />
                  </React.Suspense>
                } />
                <Route path="monitor/logs/login" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <LoginLogs />
                  </React.Suspense>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
  );
};

export default App;
