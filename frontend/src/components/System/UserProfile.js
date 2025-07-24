import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Row,
  Col,
  message,
  Divider,
  Modal,
  Descriptions,
  Space,
  Select
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  LockOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { systemAPI } from '../../services/api';

const { Option } = Select;

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        userName: user.userName,
        nickName: user.nickName,
        email: user.email,
        phonenumber: user.phonenumber,
        sex: user.sex,
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await systemAPI.updateProfile(values);
      if (response.data.code === 200) {
        message.success('Profile updated successfully');
        // Update user context
        await updateUser();
      } else {
        message.error(response.data.msg || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      const response = await systemAPI.updatePassword(values);
      if (response.data.code === 200) {
        message.success('Password changed successfully');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(response.data.msg || 'Failed to change password');
      }
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  const handleAvatarUpload = async (file) => {
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('avatarfile', file);

    try {
      const response = await systemAPI.uploadAvatar(formData);
      if (response.data.code === 200) {
        message.success('Avatar updated successfully');
        // Update user context
        await updateUser();
      } else {
        message.error(response.data.msg || 'Failed to upload avatar');
      }
    } catch (error) {
      message.error('Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    return true;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card title="User Profile" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={user.avatar}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <br />
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={({ file }) => handleAvatarUpload(file)}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={avatarLoading}
                >
                  Change Avatar
                </Button>
              </Upload>
            </Card>
          </Col>
          
          <Col span={16}>
            <Card size="small" title="Basic Information">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="User ID">
                  {user.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {user.userName}
                </Descriptions.Item>
                <Descriptions.Item label="Nickname">
                  {user.nickName}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  {user.dept?.deptName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.email || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {user.phonenumber || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {user.sex === '0' ? 'Male' : user.sex === '1' ? 'Female' : 'Unknown'}
                </Descriptions.Item>
                <Descriptions.Item label="Create Time">
                  {user.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="Last Login Time" span={2}>
                  {user.loginDate || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Edit Profile">
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nickName"
                label="Nickname"
                rules={[
                  { required: true, message: 'Please input your nickname!' },
                  { min: 2, max: 30, message: 'Nickname must be 2-30 characters!' },
                ]}
              >
                <Input placeholder="Enter your nickname" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phonenumber"
                label="Phone Number"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number!' },
                ]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sex"
                label="Gender"
              >
                <Select placeholder="Select gender">
                  <Option value="0">Male</Option>
                  <Option value="1">Female</Option>
                  <Option value="2">Unknown</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
              <Button 
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        visible={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please input your current password!' },
            ]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, max: 20, message: 'Password must be 6-20 characters!' },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
              <Button onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
