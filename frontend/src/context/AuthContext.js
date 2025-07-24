import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = Cookies.get('Admin-Token');
    if (token) {
      try {
        // Verify token by getting user info
        const response = await authAPI.getUserInfo();
        if (response.data.code === 200) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          // Token is invalid, remove it
          Cookies.remove('Admin-Token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        Cookies.remove('Admin-Token');
      }
    }
    setLoading(false);
  };

  const login = async (token) => {
    try {
      // Set token in cookies
      Cookies.set('Admin-Token', token, { expires: 7 }); // 7 days
      
      // Get user info
      const response = await authAPI.getUserInfo();
      if (response.data.code === 200) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Cookies.remove('Admin-Token');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API (if exists)
      // await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local state regardless of API call result
      Cookies.remove('Admin-Token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const updateUser = async () => {
    try {
      const response = await authAPI.getUserInfo();
      if (response.data.code === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
