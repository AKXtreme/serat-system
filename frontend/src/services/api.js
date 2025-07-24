import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('Admin-Token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      Cookies.remove('Admin-Token');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      message.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      message.error('Request timeout. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Get captcha image
  getCaptcha: () => api.get('/captchaImage'),
  
  // Login
  login: (data) => api.post('/auth/login', data),
  
  // Get user info
  getUserInfo: () => api.get('/auth/getInfo'),
  
  // Get user routes/menus
  getRouters: () => api.get('/auth/getRouters'),
  
  // Logout (if backend supports it)
  logout: () => api.post('/auth/logout'),

  // Register new user
  register: (data) => api.post('/register', data),
};

// System management APIs
export const systemAPI = {
  // User management
  getUsers: (params) => api.get('/system/user/list', { params }),
  createUser: (data) => api.post('/system/user', data),
  updateUser: (data) => api.put('/system/user', data),
  deleteUser: (userId) => api.delete(`/system/user/${userId}`),
  deleteUsers: (userIds) => api.delete(`/system/user/${userIds.join(',')}`),
  resetPassword: (userId, password) => api.put(`/system/user/resetPwd`, { userId, password }),
  changeStatus: (userId, status) => api.put('/system/user/changeStatus', { userId, status }),
  exportUsers: () => api.get('/system/user/export', { responseType: 'blob' }),

  // Role management
  getRoles: (params) => api.get('/system/role/list', { params }),
  createRole: (data) => api.post('/system/role', data),
  updateRole: (data) => api.put('/system/role', data),
  deleteRole: (roleId) => api.delete(`/system/role/${roleId}`),
  deleteRoles: (roleIds) => api.delete(`/system/role/${roleIds.join(',')}`),
  changeRoleStatus: (roleId, status) => api.put('/system/role/changeStatus', { roleId, status }),
  getMenuTreeByRole: (roleId) => api.get(`/system/menu/roleMenuTreeselect/${roleId}`),
  
  // Department management
  getDepartments: (params) => api.get('/system/dept/list', { params }),
  createDepartment: (data) => api.post('/system/dept', data),
  updateDepartment: (data) => api.put('/system/dept', data),
  deleteDepartment: (deptId) => api.delete(`/system/dept/${deptId}`),
  
  // Menu management  
  getMenus: (params) => api.get('/system/menu/list', { params }),
  createMenu: (data) => api.post('/system/menu', data),
  updateMenu: (data) => api.put('/system/menu', data),
  deleteMenu: (menuId) => api.delete(`/system/menu/${menuId}`),

  // Position management
  getPositions: (params) => api.get('/system/post/list', { params }),
  createPosition: (data) => api.post('/system/post', data),
  updatePosition: (data) => api.put('/system/post', data),
  deletePosition: (postId) => api.delete(`/system/post/${postId}`),
  deletePositions: (postIds) => api.delete(`/system/post/${postIds.join(',')}`),
  exportPositions: () => api.get('/system/post/export', { responseType: 'blob' }),

  // Dictionary management
  getDictTypes: (params) => api.get('/system/dict/type/list', { params }),
  createDictType: (data) => api.post('/system/dict/type', data),
  updateDictType: (data) => api.put('/system/dict/type', data),
  deleteDictType: (dictId) => api.delete(`/system/dict/type/${dictId}`),
  getDictData: (dictType) => api.get(`/system/dict/data/type/${dictType}`),
  createDictData: (data) => api.post('/system/dict/data', data),
  updateDictData: (data) => api.put('/system/dict/data', data),
  deleteDictData: (dictCode) => api.delete(`/system/dict/data/${dictCode}`),

  // System configuration
  getConfigs: (params) => api.get('/system/config/list', { params }),
  createConfig: (data) => api.post('/system/config', data),
  updateConfig: (data) => api.put('/system/config', data),
  deleteConfig: (configId) => api.delete(`/system/config/${configId}`),
  refreshConfigCache: () => api.delete('/system/config/refreshCache'),
  exportConfigs: () => api.get('/system/config/export', { responseType: 'blob' }),

  // Notice management
  getNotices: (params) => api.get('/system/notice/list', { params }),
  createNotice: (data) => api.post('/system/notice', data),
  updateNotice: (data) => api.put('/system/notice', data),
  deleteNotice: (noticeId) => api.delete(`/system/notice/${noticeId}`),

  // User profile management
  getProfile: () => api.get('/system/user/profile'),
  updateProfile: (data) => api.put('/system/user/profile', data),
  updatePassword: (data) => api.put('/system/user/profile/updatePwd', data),
  uploadAvatar: (formData) => api.post('/system/user/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Common file management APIs
export const commonAPI = {
  // File upload
  uploadFile: (formData) => api.post('/common/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // File download
  downloadFile: (fileName) => api.get(`/common/download?fileName=${fileName}`, {
    responseType: 'blob'
  }),
  
  // Get file info
  getFileInfo: (fileName) => api.get(`/common/download/resource?resource=${fileName}`),
};

// Monitor API endpoints
export const monitorAPI = {
  // Server info
  getServerInfo: () => api.get('/monitor/server'),
  
  // Online users
  getOnlineUsers: (params) => api.get('/monitor/online/list', { params }),
  forceLogout: (sessionId) => api.delete(`/monitor/online/${sessionId}`),
  
  // Cache monitoring
  getCacheInfo: () => api.get('/monitor/cache'),
  getCacheKeys: () => api.get('/monitor/cache/getKeys'),
  deleteCacheKey: (key) => api.delete(`/monitor/cache/getKeys/${key}`),
  clearCache: () => api.delete('/monitor/cache/clearCacheAll'),
  
  // Login logs
  getLoginLogs: (params) => api.get('/monitor/logininfor/list', { params }),
  exportLoginLogs: () => api.get('/monitor/logininfor/export', { responseType: 'blob' }),
  
  // Operation logs
  getOperationLogs: (params) => api.get('/monitor/operlog/list', { params }),
  exportOperationLogs: () => api.get('/monitor/operlog/export', { responseType: 'blob' }),
};

export default api;
