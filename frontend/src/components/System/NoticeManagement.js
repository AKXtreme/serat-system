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
  Descriptions,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  NotificationOutlined,
  BellOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';
import moment from 'moment';

const { Search, TextArea } = Input;
const { Option } = Select;

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getNotices();
      if (response.data.code === 200) {
        setNotices(response.data.rows || []);
      }
    } catch (error) {
      message.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedNotice(null);
    form.resetFields();
    form.setFieldsValue({
      noticeType: '1',
      status: '0',
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedNotice(record);
    form.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedNotice(record);
    setDetailModalVisible(true);
  };

  const handleDelete = async (noticeId) => {
    try {
      const response = await systemAPI.deleteNotice(noticeId);
      if (response.data.code === 200) {
        message.success('Notice deleted successfully');
        fetchNotices();
      } else {
        message.error(response.data.msg || 'Failed to delete notice');
      }
    } catch (error) {
      message.error('Failed to delete notice');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const noticeData = {
        ...values,
        noticeId: modalType === 'edit' ? selectedNotice.noticeId : undefined,
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createNotice(noticeData);
      } else {
        response = await systemAPI.updateNotice(noticeData);
      }

      if (response.data.code === 200) {
        message.success(`Notice ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchNotices();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} notice`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} notice`);
    }
  };

  const getNoticeTypeText = (noticeType) => {
    const types = {
      '1': 'Notice',
      '2': 'Announcement',
    };
    return types[noticeType] || 'Unknown';
  };

  const getNoticeTypeColor = (noticeType) => {
    const colors = {
      '1': 'blue',
      '2': 'green',
    };
    return colors[noticeType] || 'default';
  };

  const getStatusText = (status) => {
    return status === '0' ? 'Normal' : 'Closed';
  };

  const getStatusColor = (status) => {
    return status === '0' ? 'green' : 'red';
  };

  const filteredNotices = notices.filter(notice => {
    if (!searchValue) return true;
    return (
      notice.noticeTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
      notice.noticeContent.toLowerCase().includes(searchValue.toLowerCase()) ||
      notice.createBy.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Notice ID',
      dataIndex: 'noticeId',
      key: 'noticeId',
      width: 100,
    },
    {
      title: 'Notice Title',
      dataIndex: 'noticeTitle',
      key: 'noticeTitle',
      render: (text, record) => (
        <Space>
          {record.noticeType === '1' ? 
            <NotificationOutlined style={{ color: '#1890ff' }} /> : 
            <BellOutlined style={{ color: '#52c41a' }} />
          }
          <Button type="link" onClick={() => handleView(record)} style={{ padding: 0 }}>
            {text}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Notice Type',
      dataIndex: 'noticeType',
      key: 'noticeType',
      render: (noticeType) => (
        <Tag color={getNoticeTypeColor(noticeType)}>
          {getNoticeTypeText(noticeType)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === '0' ? 'processing' : 'error'}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: 'Create By',
      dataIndex: 'createBy',
      key: 'createBy',
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => moment(a.createTime).unix() - moment(b.createTime).unix(),
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
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
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Notice"
            description="Are you sure you want to delete this notice?"
            onConfirm={() => handleDelete(record.noticeId)}
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
      <Card title="Notice Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search notices"
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
                Add Notice
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchNotices}
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
          dataSource={filteredNotices}
          rowKey="noticeId"
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

      {/* Notice Modal */}
      <Modal
        title={modalType === 'add' ? 'Add Notice' : 'Edit Notice'}
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
            noticeType: '1',
            status: '0',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="noticeTitle"
                label="Notice Title"
                rules={[
                  { required: true, message: 'Please input notice title!' },
                  { min: 2, max: 50, message: 'Notice title must be 2-50 characters!' },
                ]}
              >
                <Input placeholder="Enter notice title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="noticeType"
                label="Notice Type"
                rules={[
                  { required: true, message: 'Please select notice type!' },
                ]}
              >
                <Select>
                  <Option value="1">Notice</Option>
                  <Option value="2">Announcement</Option>
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
                  <Option value="1">Closed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="noticeContent"
                label="Notice Content"
                rules={[
                  { required: true, message: 'Please input notice content!' },
                  { min: 10, max: 2000, message: 'Notice content must be 10-2000 characters!' },
                ]}
              >
                <TextArea
                  rows={10}
                  placeholder="Enter notice content"
                  showCount
                  maxLength={2000}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="Remark"
              >
                <TextArea
                  rows={3}
                  placeholder="Enter remark (optional)"
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Notice Detail Modal */}
      <Modal
        title="Notice Details"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setDetailModalVisible(false);
            handleEdit(selectedNotice);
          }}>
            Edit
          </Button>,
        ]}
        width={800}
      >
        {selectedNotice && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Notice ID" span={1}>
                {selectedNotice.noticeId}
              </Descriptions.Item>
              <Descriptions.Item label="Notice Type" span={1}>
                <Tag color={getNoticeTypeColor(selectedNotice.noticeType)}>
                  {getNoticeTypeText(selectedNotice.noticeType)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Notice Title" span={2}>
                <strong>{selectedNotice.noticeTitle}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={1}>
                <Badge 
                  status={selectedNotice.status === '0' ? 'processing' : 'error'}
                  text={getStatusText(selectedNotice.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Create By" span={1}>
                {selectedNotice.createBy}
              </Descriptions.Item>
              <Descriptions.Item label="Create Time" span={1}>
                {selectedNotice.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="Update Time" span={1}>
                {selectedNotice.updateTime || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Notice Content" size="small">
              <div style={{ 
                minHeight: 200,
                padding: '16px',
                background: '#fafafa',
                borderRadius: '6px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {selectedNotice.noticeContent}
              </div>
            </Card>

            {selectedNotice.remark && (
              <Card title="Remark" size="small" style={{ marginTop: 16 }}>
                <div style={{ 
                  padding: '8px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  {selectedNotice.remark}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NoticeManagement;
