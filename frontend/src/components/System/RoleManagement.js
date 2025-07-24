import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Select,
  Switch,
  Tree
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchMenus();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getRoles({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      });
      
      if (response.data.code === 200) {
        setRoles(response.data.rows || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await systemAPI.getMenus();
      if (response.data.code === 200) {
        setMenus(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ roleName: value });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (roleId) => {
    try {
      const response = await systemAPI.deleteRole(roleId);
      if (response.data.code === 200) {
        message.success('Role deleted successfully');
        fetchRoles();
      } else {
        message.error(response.data.msg || 'Failed to delete role');
      }
    } catch (error) {
      message.error('Failed to delete role');
    }
  };

  const handleAssignPermissions = (record) => {
    setSelectedRole(record);
    setSelectedMenuKeys(record.menuIds || []);
    setPermissionModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const roleData = {
        ...values,
        roleId: modalType === 'edit' ? selectedRole.roleId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createRole(roleData);
      } else {
        response = await systemAPI.updateRole(roleData);
      }

      if (response.data.code === 200) {
        message.success(`Role ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchRoles();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} role`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} role`);
    }
  };

  const handlePermissionOk = async () => {
    try {
      const response = await systemAPI.updateRoleMenus({
        roleId: selectedRole.roleId,
        menuIds: selectedMenuKeys,
      });

      if (response.data.code === 200) {
        message.success('Permissions updated successfully');
        setPermissionModalVisible(false);
        fetchRoles();
      } else {
        message.error(response.data.msg || 'Failed to update permissions');
      }
    } catch (error) {
      message.error('Failed to update permissions');
    }
  };

  const buildMenuTree = (menus, parentId = 0) => {
    return menus
      .filter(menu => menu.parentId === parentId)
      .map(menu => ({
        title: menu.menuName,
        key: menu.menuId,
        children: buildMenuTree(menus, menu.menuId),
      }));
  };

  const columns = [
    {
      title: 'Role ID',
      dataIndex: 'roleId',
      key: 'roleId',
      width: 80,
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text) => (
        <Space>
          <SafetyCertificateOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Role Key',
      dataIndex: 'roleKey',
      key: 'roleKey',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'roleSort',
      key: 'roleSort',
      width: 100,
    },
    {
      title: 'Data Scope',
      dataIndex: 'dataScope',
      key: 'dataScope',
      render: (dataScope) => {
        const scopeMap = {
          '1': 'All data',
          '2': 'Custom data',
          '3': 'Department data',
          '4': 'Department and sub-department data',
          '5': 'Personal data only',
        };
        return <Tag color="green">{scopeMap[dataScope] || 'Unknown'}</Tag>;
      },
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
      width: 180,
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
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleAssignPermissions(record)}
          >
            Permissions
          </Button>
          <Popconfirm
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record.roleId)}
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
      <Card title="Role Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search by role name"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Role
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRoles}
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
          dataSource={roles}
          rowKey="roleId"
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

      {/* Add/Edit Role Modal */}
      <Modal
        title={modalType === 'add' ? 'Add Role' : 'Edit Role'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '0',
            dataScope: '1',
            menuCheckStrictly: true,
            deptCheckStrictly: true,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="Role Name"
                rules={[
                  { required: true, message: 'Please input role name!' },
                ]}
              >
                <Input placeholder="Enter role name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleKey"
                label="Role Key"
                rules={[
                  { required: true, message: 'Please input role key!' },
                ]}
              >
                <Input placeholder="Enter role key" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleSort"
                label="Sort Order"
                rules={[
                  { required: true, message: 'Please input sort order!' },
                ]}
              >
                <Input type="number" placeholder="Enter sort order" />
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dataScope"
                label="Data Scope"
              >
                <Select>
                  <Option value="1">All data</Option>
                  <Option value="2">Custom data</Option>
                  <Option value="3">Department data</Option>
                  <Option value="4">Department and sub-department data</Option>
                  <Option value="5">Personal data only</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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

      {/* Permission Assignment Modal */}
      <Modal
        title={`Assign Permissions - ${selectedRole?.roleName}`}
        visible={permissionModalVisible}
        onOk={handlePermissionOk}
        onCancel={() => setPermissionModalVisible(false)}
        width={500}
        okText="Save Permissions"
      >
        <Tree
          checkable
          checkedKeys={selectedMenuKeys}
          onCheck={setSelectedMenuKeys}
          treeData={buildMenuTree(menus)}
          height={400}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;
