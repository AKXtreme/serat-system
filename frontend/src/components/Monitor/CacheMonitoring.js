import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Progress
} from 'antd';
import {
  ReloadOutlined,
  DeleteOutlined,
  ClearOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { monitorAPI } from '../../services/api';

const CacheMonitoring = () => {
  const [cacheInfo, setCacheInfo] = useState(null);
  const [cacheKeys, setCacheKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCacheInfo();
    fetchCacheKeys();
  }, []);

  const fetchCacheInfo = async () => {
    setLoading(true);
    try {
      const response = await monitorAPI.getCacheInfo();
      if (response.data.code === 200) {
        setCacheInfo(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch cache information');
    } finally {
      setLoading(false);
    }
  };

  const fetchCacheKeys = async () => {
    try {
      const response = await monitorAPI.getCacheKeys();
      if (response.data.code === 200) {
        setCacheKeys(response.data.data || []);
      }
    } catch (error) {
      message.error('Failed to fetch cache keys');
    }
  };

  const handleClearCache = async () => {
    try {
      const response = await monitorAPI.clearCache();
      if (response.data.code === 200) {
        message.success('Cache cleared successfully');
        fetchCacheInfo();
        fetchCacheKeys();
      } else {
        message.error(response.data.msg || 'Failed to clear cache');
      }
    } catch (error) {
      message.error('Failed to clear cache');
    }
  };

  const handleDeleteKey = async (key) => {
    try {
      const response = await monitorAPI.deleteCacheKey(key);
      if (response.data.code === 200) {
        message.success('Cache key deleted successfully');
        fetchCacheKeys();
        fetchCacheInfo();
      } else {
        message.error(response.data.msg || 'Failed to delete cache key');
      }
    } catch (error) {
      message.error('Failed to delete cache key');
    }
  };

  const columns = [
    {
      title: 'Cache Key',
      dataIndex: 'key',
      key: 'key',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${size} bytes`,
    },
    {
      title: 'TTL',
      dataIndex: 'ttl',
      key: 'ttl',
      render: (ttl) => {
        if (ttl === -1) return <Tag color="green">Permanent</Tag>;
        if (ttl === -2) return <Tag color="red">Expired</Tag>;
        return <Tag color="orange">{ttl}s</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Delete Cache Key"
            description="Are you sure you want to delete this cache key?"
            onConfirm={() => handleDeleteKey(record.key)}
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

  // Sample data for demo
  const sampleKeys = [
    { key: 'login_tokens:user:123', type: 'string', size: 1024, ttl: 3600 },
    { key: 'user_session:456', type: 'hash', size: 2048, ttl: 7200 },
    { key: 'cache:menu:tree', type: 'string', size: 512, ttl: -1 },
    { key: 'rate_limit:192.168.1.1', type: 'string', size: 64, ttl: 60 },
  ];

  return (
    <div>
      <Card 
        title="Redis Cache Monitoring" 
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                fetchCacheInfo();
                fetchCacheKeys();
              }}
              loading={loading}
            >
              Refresh
            </Button>
            <Popconfirm
              title="Clear All Cache"
              description="Are you sure you want to clear all cache? This action cannot be undone."
              onConfirm={handleClearCache}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<ClearOutlined />}>
                Clear All
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Keys"
                value={156}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Memory Usage"
                value={24.5}
                precision={1}
                suffix="MB"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress percent={65.2} showInfo={false} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Hit Rate"
                value={94.2}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
              <Progress percent={94.2} showInfo={false} strokeColor="#722ed1" />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Connected Clients"
                value={8}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Cache Keys" size="small">
          <Table
            columns={columns}
            dataSource={cacheKeys.length > 0 ? cacheKeys : sampleKeys}
            rowKey="key"
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
      </Card>
    </div>
  );
};

export default CacheMonitoring;
