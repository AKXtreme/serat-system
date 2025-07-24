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
  Tabs,
  Drawer
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  BookOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const DictionaryManagement = () => {
  const [dictTypes, setDictTypes] = useState([]);
  const [dictData, setDictData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedDict, setSelectedDict] = useState(null);
  const [selectedDictData, setSelectedDictData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [dataSearchValue, setDataSearchValue] = useState('');
  const [currentDictType, setCurrentDictType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataForm] = Form.useForm();

  useEffect(() => {
    fetchDictTypes();
  }, []);

  const fetchDictTypes = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getDictTypes();
      if (response.data.code === 200) {
        setDictTypes(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch dictionary types');
    } finally {
      setLoading(false);
    }
  };

  const fetchDictData = async (dictType) => {
    setDataLoading(true);
    try {
      const response = await systemAPI.getDictData(dictType);
      if (response.data.code === 200) {
        setDictData(response.data.data || []);
      }
    } catch (error) {
      message.error('Failed to fetch dictionary data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddType = () => {
    setModalType('add');
    setSelectedDict(null);
    form.resetFields();
    form.setFieldsValue({
      status: '0',
    });
    setModalVisible(true);
  };

  const handleEditType = (record) => {
    setModalType('edit');
    setSelectedDict(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  const handleDeleteType = async (dictId) => {
    try {
      const response = await systemAPI.deleteDictType(dictId);
      if (response.data.code === 200) {
        message.success('Dictionary type deleted successfully');
        fetchDictTypes();
      } else {
        message.error(response.data.msg || 'Failed to delete dictionary type');
      }
    } catch (error) {
      message.error('Failed to delete dictionary type');
    }
  };

  const handleTypeModalOk = async () => {
    try {
      const values = await form.validateFields();
      const dictTypeData = {
        ...values,
        dictId: modalType === 'edit' ? selectedDict.dictId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createDictType(dictTypeData);
      } else {
        response = await systemAPI.updateDictType(dictTypeData);
      }

      if (response.data.code === 200) {
        message.success(`Dictionary type ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchDictTypes();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} dictionary type`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} dictionary type`);
    }
  };

  const handleAddData = () => {
    if (!currentDictType) {
      message.warning('Please select a dictionary type first');
      return;
    }
    setModalType('add');
    setSelectedDictData(null);
    dataForm.resetFields();
    dataForm.setFieldsValue({
      dictType: currentDictType.dictType,
      status: '0',
      dictSort: 0,
      isDefault: 'N',
    });
    setDataModalVisible(true);
  };

  const handleEditData = (record) => {
    setModalType('edit');
    setSelectedDictData(record);
    dataForm.setFieldsValue({
      ...record,
    });
    setDataModalVisible(true);
  };

  const handleDeleteData = async (dictCode) => {
    try {
      const response = await systemAPI.deleteDictData(dictCode);
      if (response.data.code === 200) {
        message.success('Dictionary data deleted successfully');
        fetchDictData(currentDictType.dictType);
      } else {
        message.error(response.data.msg || 'Failed to delete dictionary data');
      }
    } catch (error) {
      message.error('Failed to delete dictionary data');
    }
  };

  const handleDataModalOk = async () => {
    try {
      const values = await dataForm.validateFields();
      const dictDataData = {
        ...values,
        dictCode: modalType === 'edit' ? selectedDictData.dictCode : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createDictData(dictDataData);
      } else {
        response = await systemAPI.updateDictData(dictDataData);
      }

      if (response.data.code === 200) {
        message.success(`Dictionary data ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setDataModalVisible(false);
        fetchDictData(currentDictType.dictType);
      } else {
        message.error(response.data.msg || `Failed to ${modalType} dictionary data`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} dictionary data`);
    }
  };

  const handleViewData = (record) => {
    setCurrentDictType(record);
    fetchDictData(record.dictType);
    setDrawerVisible(true);
  };

  const filteredDictTypes = dictTypes.filter(dict => {
    if (!searchValue) return true;
    return (
      dict.dictName.toLowerCase().includes(searchValue.toLowerCase()) ||
      dict.dictType.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const filteredDictData = dictData.filter(data => {
    if (!dataSearchValue) return true;
    return (
      data.dictLabel.toLowerCase().includes(dataSearchValue.toLowerCase()) ||
      data.dictValue.toLowerCase().includes(dataSearchValue.toLowerCase())
    );
  });

  const typeColumns = [
    {
      title: 'Dictionary ID',
      dataIndex: 'dictId',
      key: 'dictId',
      width: 100,
    },
    {
      title: 'Dictionary Name',
      dataIndex: 'dictName',
      key: 'dictName',
      render: (text) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Dictionary Type',
      dataIndex: 'dictType',
      key: 'dictType',
      render: (text) => <Tag color="blue">{text}</Tag>,
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
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<UnorderedListOutlined />}
            onClick={() => handleViewData(record)}
          >
            Data
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditType(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Dictionary Type"
            description="Are you sure you want to delete this dictionary type and all its data?"
            onConfirm={() => handleDeleteType(record.dictId)}
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

  const dataColumns = [
    {
      title: 'Dictionary Code',
      dataIndex: 'dictCode',
      key: 'dictCode',
      width: 120,
    },
    {
      title: 'Dictionary Label',
      dataIndex: 'dictLabel',
      key: 'dictLabel',
      render: (text, record) => (
        <Space>
          {record.isDefault === 'Y' && <Tag color="gold">Default</Tag>}
          {text}
        </Space>
      ),
    },
    {
      title: 'Dictionary Value',
      dataIndex: 'dictValue',
      key: 'dictValue',
      render: (text) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'CSS Class',
      dataIndex: 'cssClass',
      key: 'cssClass',
      render: (text) => text || '-',
    },
    {
      title: 'List Class',
      dataIndex: 'listClass',
      key: 'listClass',
      render: (text) => text ? <Tag color={text}>{text}</Tag> : '-',
    },
    {
      title: 'Sort',
      dataIndex: 'dictSort',
      key: 'dictSort',
      width: 80,
      sorter: (a, b) => a.dictSort - b.dictSort,
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
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditData(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Dictionary Data"
            description="Are you sure you want to delete this dictionary data?"
            onConfirm={() => handleDeleteData(record.dictCode)}
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
    <div>
      <Card title="Dictionary Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search dictionary types"
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
                onClick={handleAddType}
              >
                Add Dictionary Type
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchDictTypes}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={typeColumns}
          dataSource={filteredDictTypes}
          rowKey="dictId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      {/* Dictionary Type Modal */}
      <Modal
        title={modalType === 'add' ? 'Add Dictionary Type' : 'Edit Dictionary Type'}
        visible={modalVisible}
        onOk={handleTypeModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '0',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dictName"
                label="Dictionary Name"
                rules={[
                  { required: true, message: 'Please input dictionary name!' },
                  { min: 2, max: 100, message: 'Dictionary name must be 2-100 characters!' },
                ]}
              >
                <Input placeholder="Enter dictionary name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dictType"
                label="Dictionary Type"
                rules={[
                  { required: true, message: 'Please input dictionary type!' },
                  { min: 2, max: 100, message: 'Dictionary type must be 2-100 characters!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Dictionary type can only contain letters, numbers, and underscores!' },
                ]}
              >
                <Input placeholder="Enter dictionary type" />
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

      {/* Dictionary Data Drawer */}
      <Drawer
        title={currentDictType ? `Dictionary Data - ${currentDictType.dictName}` : 'Dictionary Data'}
        width={1000}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddData}
            >
              Add Data
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => currentDictType && fetchDictData(currentDictType.dictType)}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search dictionary data"
            value={dataSearchValue}
            onChange={(e) => setDataSearchValue(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Table
          columns={dataColumns}
          dataSource={filteredDictData}
          rowKey="dictCode"
          loading={dataLoading}
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Drawer>

      {/* Dictionary Data Modal */}
      <Modal
        title={modalType === 'add' ? 'Add Dictionary Data' : 'Edit Dictionary Data'}
        visible={dataModalVisible}
        onOk={handleDataModalOk}
        onCancel={() => setDataModalVisible(false)}
        width={700}
        okText={modalType === 'add' ? 'Create' : 'Update'}
      >
        <Form
          form={dataForm}
          layout="vertical"
          initialValues={{
            status: '0',
            dictSort: 0,
            isDefault: 'N',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dictType"
                label="Dictionary Type"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dictSort"
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dictLabel"
                label="Dictionary Label"
                rules={[
                  { required: true, message: 'Please input dictionary label!' },
                  { min: 1, max: 100, message: 'Dictionary label must be 1-100 characters!' },
                ]}
              >
                <Input placeholder="Enter dictionary label" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dictValue"
                label="Dictionary Value"
                rules={[
                  { required: true, message: 'Please input dictionary value!' },
                  { min: 1, max: 100, message: 'Dictionary value must be 1-100 characters!' },
                ]}
              >
                <Input placeholder="Enter dictionary value" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="cssClass"
                label="CSS Class"
              >
                <Input placeholder="Enter CSS class" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="listClass"
                label="List Class"
              >
                <Select allowClear placeholder="Select list class">
                  <Option value="default">Default</Option>
                  <Option value="primary">Primary</Option>
                  <Option value="success">Success</Option>
                  <Option value="info">Info</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="danger">Danger</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isDefault"
                label="Is Default"
              >
                <Select>
                  <Option value="Y">Yes</Option>
                  <Option value="N">No</Option>
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
                  rows={3}
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

export default DictionaryManagement;
