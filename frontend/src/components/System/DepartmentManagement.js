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
  TreeSelect,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  BankOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getDepartments();
      if (response.data.code === 200) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      message.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedDept(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedDept(record);
    form.setFieldsValue({
      ...record,
      parentId: record.parentId === 0 ? undefined : record.parentId
    });
    setModalVisible(true);
  };

  const handleDelete = async (deptId) => {
    try {
      const response = await systemAPI.deleteDepartment(deptId);
      if (response.data.code === 200) {
        message.success('Department deleted successfully');
        fetchDepartments();
      } else {
        message.error(response.data.msg || 'Failed to delete department');
      }
    } catch (error) {
      message.error('Failed to delete department');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const deptData = {
        ...values,
        deptId: modalType === 'edit' ? selectedDept.deptId : undefined,
        parentId: values.parentId || 0,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createDepartment(deptData);
      } else {
        response = await systemAPI.updateDepartment(deptData);
      }

      if (response.data.code === 200) {
        message.success(`Department ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchDepartments();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} department`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} department`);
    }
  };

  const buildTreeData = (departments, parentId = 0) => {
    return departments
      .filter(dept => dept.parentId === parentId)
      .map(dept => ({
        title: dept.deptName,
        value: dept.deptId,
        key: dept.deptId,
        children: buildTreeData(departments, dept.deptId),
      }));
  };

  const expandedRowRender = (record) => {
    const children = departments.filter(dept => dept.parentId === record.deptId);
    
    if (children.length === 0) {
      return <div style={{ padding: '8px 0', color: '#999' }}>No sub-departments</div>;
    }

    const childColumns = [
      {
        title: 'Department Name',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text) => (
          <Space>
            <BankOutlined style={{ color: '#1890ff' }} />
            {text}
          </Space>
        ),
      },
      {
        title: 'Leader',
        dataIndex: 'leader',
        key: 'leader',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
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
        title: 'Actions',
        key: 'actions',
        width: 200,
        render: (_, record) => (
          <Space size="small">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete Department"
              description="Are you sure you want to delete this department?"
              onConfirm={() => handleDelete(record.deptId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={childColumns}
        dataSource={children}
        rowKey="deptId"
        pagination={false}
        size="small"
      />
    );
  };

  const filteredDepartments = departments.filter(dept => {
    if (!searchValue) return dept.parentId === 0; // Only show top-level departments
    return dept.deptName.toLowerCase().includes(searchValue.toLowerCase()) && dept.parentId === 0;
  });

  const columns = [
    {
      title: 'Department ID',
      dataIndex: 'deptId',
      key: 'deptId',
      width: 100,
    },
    {
      title: 'Department Name',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text, record) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          {text}
          {departments.filter(d => d.parentId === record.deptId).length > 0 && (
            <Tag color="blue">{departments.filter(d => d.parentId === record.deptId).length} sub-depts</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 80,
      sorter: (a, b) => a.orderNum - b.orderNum,
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (text) => text || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-',
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
      width: 200,
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
            title="Delete Department"
            description="Are you sure you want to delete this department and all its sub-departments?"
            onConfirm={() => handleDelete(record.deptId)}
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
      <Card title="Department Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search departments"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
                Add Department
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchDepartments}
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
          dataSource={filteredDepartments}
          rowKey="deptId"
          loading={loading}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => 
              departments.filter(dept => dept.parentId === record.deptId).length > 0,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={modalType === 'add' ? 'Add Department' : 'Edit Department'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '0',
            orderNum: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deptName"
                label="Department Name"
                rules={[
                  { required: true, message: 'Please input department name!' },
                  { min: 2, max: 30, message: 'Department name must be 2-30 characters!' },
                ]}
              >
                <Input placeholder="Enter department name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="Parent Department"
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={buildTreeData(departments)}
                  placeholder="Select parent department (optional)"
                  treeDefaultExpandAll
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderNum"
                label="Display Order"
                rules={[
                  { required: true, message: 'Please input display order!' },
                ]}
              >
                <InputNumber
                  min={0}
                  max={9999}
                  placeholder="Enter display order"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="leader"
                label="Department Leader"
              >
                <Input placeholder="Enter department leader" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Contact Phone"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number!' },
                ]}
              >
                <Input placeholder="Enter contact phone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Contact Email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="Enter contact email" />
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
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
