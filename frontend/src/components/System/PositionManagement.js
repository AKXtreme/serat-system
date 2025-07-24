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
  InputNumber,
  Upload,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getPositions();
      if (response.data.code === 200) {
        setPositions(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedPosition(null);
    form.resetFields();
    form.setFieldsValue({
      status: '0',
      postSort: 0,
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedPosition(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await systemAPI.deletePosition(postId);
      if (response.data.code === 200) {
        message.success('Position deleted successfully');
        fetchPositions();
      } else {
        message.error(response.data.msg || 'Failed to delete position');
      }
    } catch (error) {
      message.error('Failed to delete position');
    }
  };

  const handleBatchDelete = async (postIds) => {
    try {
      const response = await systemAPI.deletePositions(postIds);
      if (response.data.code === 200) {
        message.success('Positions deleted successfully');
        fetchPositions();
      } else {
        message.error(response.data.msg || 'Failed to delete positions');
      }
    } catch (error) {
      message.error('Failed to delete positions');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const positionData = {
        ...values,
        postId: modalType === 'edit' ? selectedPosition.postId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createPosition(positionData);
      } else {
        response = await systemAPI.updatePosition(positionData);
      }

      if (response.data.code === 200) {
        message.success(`Position ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchPositions();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} position`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} position`);
    }
  };

  const handleExport = async () => {
    try {
      const response = await systemAPI.exportPositions();
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'positions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Export successful');
    } catch (error) {
      message.error('Export failed');
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/system/post/importData',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        fetchPositions();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const filteredPositions = positions.filter(position => {
    if (!searchValue) return true;
    return (
      position.postName.toLowerCase().includes(searchValue.toLowerCase()) ||
      position.postCode.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Position ID',
      dataIndex: 'postId',
      key: 'postId',
      width: 100,
    },
    {
      title: 'Position Code',
      dataIndex: 'postCode',
      key: 'postCode',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Position Name',
      dataIndex: 'postName',
      key: 'postName',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Display Order',
      dataIndex: 'postSort',
      key: 'postSort',
      width: 120,
      sorter: (a, b) => a.postSort - b.postSort,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === '0' ? 'green' : 'red'}>
          {status === '0' ? 'Normal' : 'Disabled'}
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
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (text) => text || '-',
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
            title="Delete Position"
            description="Are you sure you want to delete this position?"
            onConfirm={() => handleDelete(record.postId)}
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <Card title="Position Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search positions"
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
                Add Position
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>
                  Import
                </Button>
              </Upload>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchPositions}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
        
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginTop: 16 }}>
            <Col>
              <Space>
                <span>Selected {selectedRowKeys.length} items</span>
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => handleBatchDelete(selectedRowKeys)}
                >
                  Batch Delete
                </Button>
                <Button
                  size="small"
                  onClick={() => setSelectedRowKeys([])}
                >
                  Clear Selection
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredPositions}
          rowKey="postId"
          loading={loading}
          rowSelection={rowSelection}
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
        title={modalType === 'add' ? 'Add Position' : 'Edit Position'}
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
            postSort: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="postName"
                label="Position Name"
                rules={[
                  { required: true, message: 'Please input position name!' },
                  { min: 2, max: 50, message: 'Position name must be 2-50 characters!' },
                ]}
              >
                <Input placeholder="Enter position name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="postCode"
                label="Position Code"
                rules={[
                  { required: true, message: 'Please input position code!' },
                  { min: 2, max: 64, message: 'Position code must be 2-64 characters!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Position code can only contain letters, numbers, and underscores!' },
                ]}
              >
                <Input placeholder="Enter position code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="postSort"
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
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="0">Normal</Option>
                  <Option value="1">Disabled</Option>
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
                <Input.TextArea
                  rows={4}
                  placeholder="Enter remark (optional)"
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionManagement;
