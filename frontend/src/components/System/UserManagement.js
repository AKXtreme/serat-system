import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Upload,
  Row,
  Col,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  UserOutlined,
  UploadOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
    fetchPosts();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getUsers({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      });
      
      if (response.data.code === 200) {
        setUsers(response.data.rows || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await systemAPI.getDepartments();
      if (response.data.code === 200) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await systemAPI.getRoles();
      if (response.data.code === 200) {
        setRoles(response.data.rows || []);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await systemAPI.getPosts();
      if (response.data.code === 200) {
        setPosts(response.data.rows || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedUser(record);
    form.setFieldsValue({
      ...record,
      roleIds: record.roles?.map(role => role.roleId) || [],
      postIds: record.posts?.map(post => post.postId) || [],
    });
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await systemAPI.deleteUser(userId);
      if (response.data.code === 200) {
        message.success('User deleted successfully');
        fetchUsers();
      } else {
        message.error(response.data.msg || 'Failed to delete user');
      }
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const response = await systemAPI.resetUserPassword(userId);
      if (response.data.code === 200) {
        message.success('Password reset successfully');
      } else {
        message.error(response.data.msg || 'Failed to reset password');
      }
    } catch (error) {
      message.error('Failed to reset password');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const userData = {
        ...values,
        userId: modalType === 'edit' ? selectedUser.userId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createUser(userData);
      } else {
        response = await systemAPI.updateUser(userData);
      }

      if (response.data.code === 200) {
        message.success(`User ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} user`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} user`);
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size="large"
        />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
    },
    {
      title: 'Nickname',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
    },
    {
      title: 'Department',
      dataIndex: 'dept',
      key: 'deptName',
      render: (dept) => dept?.deptName || '-',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space size={[0, 8]} wrap>
          {roles?.map(role => (
            <Tag color="blue" key={role.roleId}>
              {role.roleName}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === '0' ? 'green' : 'red'}>
          {status === '0' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Reset Password"
            description="Are you sure you want to reset this user's password?"
            onConfirm={() => handleResetPassword(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<RedoOutlined />}>
              Reset Password
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="User Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Search
              placeholder="Search by username"
              onSearch={(value) => handleSearch({ userName: value })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Department"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleSearch({ deptId: value })}
            >
              {departments.map(dept => (
                <Option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Status"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleSearch({ status: value })}
            >
              <Option value="0">Active</Option>
              <Option value="1">Inactive</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add User
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
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
          dataSource={users}
          rowKey="userId"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={modalType === 'add' ? 'Add User' : 'Edit User'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '0',
            sex: '0',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userName"
                label="Username"
                rules={[
                  { required: true, message: 'Please input username!' },
                  { min: 2, max: 20, message: 'Username must be 2-20 characters!' },
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nickName"
                label="Nickname"
                rules={[
                  { required: true, message: 'Please input nickname!' },
                ]}
              >
                <Input placeholder="Enter nickname" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phonenumber"
                label="Phone Number"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number!' },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deptId"
                label="Department"
                rules={[
                  { required: true, message: 'Please select department!' },
                ]}
              >
                <Select placeholder="Select Department">
                  {departments.map(dept => (
                    <Option key={dept.deptId} value={dept.deptId}>
                      {dept.deptName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sex"
                label="Gender"
              >
                <Select>
                  <Option value="0">Male</Option>
                  <Option value="1">Female</Option>
                  <Option value="2">Unknown</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleIds"
                label="Roles"
              >
                <Select
                  mode="multiple"
                  placeholder="Select Roles"
                  style={{ width: '100%' }}
                >
                  {roles.map(role => (
                    <Option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="postIds"
                label="Posts"
              >
                <Select
                  mode="multiple"
                  placeholder="Select Posts"
                  style={{ width: '100%' }}
                >
                  {posts.map(post => (
                    <Option key={post.postId} value={post.postId}>
                      {post.postName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="0">Active</Option>
                  <Option value="1">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {modalType === 'add' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="Remark"
              >
                <Input.TextArea rows={4} placeholder="Enter remark" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
