import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [uuid, setUuid] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    fetchCaptcha();
  }, [isAuthenticated, navigate]);

  const fetchCaptcha = async () => {
    try {
      const response = await authAPI.getCaptcha();
      if (response.data.code === 200) {
        setCaptchaUrl(`data:image/png;base64,${response.data.img}`);
        setUuid(response.data.uuid);
      }
    } catch (error) {
      console.error('Failed to fetch captcha:', error);
      message.error('Failed to load captcha');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        username: values.username,
        password: values.password,
        code: values.captcha,
        uuid: uuid
      };

      const response = await authAPI.login(loginData);
      
      if (response.data.code === 200) {
        const token = response.data.token;
        await login(token);
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error(response.data.msg || 'Login failed');
        fetchCaptcha(); // Refresh captcha on error
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
      fetchCaptcha(); // Refresh captcha on error
    } finally {
      setLoading(false);
    }
  };

  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  return (
    <div className="login-container">
      <Card className="login-box">
        <div className="login-title">
          Serat
        </div>
        <div className="login-subtitle">
          Welcome back! Please sign in to your account
        </div>
        
        <Form
          form={form}
          name="login"
          className="login-form"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[
              {
                required: true,
                message: 'Please input the captcha!',
              },
            ]}
          >
            <div className="captcha-container">
              <Input
                prefix={<SafetyOutlined />}
                placeholder="Captcha"
                className="captcha-input"
              />
              {captchaUrl && (
                <img
                  src={captchaUrl}
                  alt="Captcha"
                  className="captcha-image"
                  onClick={refreshCaptcha}
                  title="Click to refresh"
                />
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          <small>
            Default credentials: admin / 123456
          </small>
        </div>
      </Card>
    </div>
  );
};

export default Login;
