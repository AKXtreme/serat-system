import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Button,
  message,
  Descriptions,
  Badge
} from 'antd';
import {
  ReloadOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  HddOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { monitorAPI } from '../../services/api';

const ServerMonitoring = () => {
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    setLoading(true);
    try {
      const response = await monitorAPI.getServerInfo();
      if (response.data.code === 200) {
        setServerInfo(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch server information');
    } finally {
      setLoading(false);
    }
  };

  if (!serverInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card 
        title="Server Monitoring" 
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchServerInfo}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="CPU Usage"
                value={75.2}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
                prefix={<ThunderboltOutlined />}
              />
              <Progress percent={75.2} showInfo={false} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Memory Usage"
                value={8.5}
                precision={1}
                suffix="GB"
                valueStyle={{ color: '#cf1322' }}
                prefix={<DatabaseOutlined />}
              />
              <Progress percent={68.4} showInfo={false} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Disk Usage"
                value={256}
                suffix="GB"
                valueStyle={{ color: '#1890ff' }}
                prefix={<HddOutlined />}
              />
              <Progress percent={45.2} showInfo={false} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Network I/O"
                value={1.2}
                precision={1}
                suffix="MB/s"
                valueStyle={{ color: '#722ed1' }}
                prefix={<DesktopOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card title="System Information" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="OS">Linux Ubuntu 20.04</Descriptions.Item>
                <Descriptions.Item label="CPU">Intel Xeon E5-2686 v4</Descriptions.Item>
                <Descriptions.Item label="Memory">16 GB</Descriptions.Item>
                <Descriptions.Item label="Java Version">OpenJDK 11.0.16</Descriptions.Item>
                <Descriptions.Item label="Server Time">2025-01-24 15:30:25</Descriptions.Item>
                <Descriptions.Item label="Uptime">
                  <Badge status="processing" text="5 days 12 hours" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="JVM Information" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="JVM Name">OpenJDK 64-Bit Server VM</Descriptions.Item>
                <Descriptions.Item label="JVM Version">11.0.16+8-post-Ubuntu</Descriptions.Item>
                <Descriptions.Item label="Heap Memory">
                  <Tag color="blue">Used: 512MB / Max: 2GB</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Non-Heap Memory">
                  <Tag color="green">Used: 128MB / Max: 512MB</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="GC Count">
                  <Tag color="orange">Young: 245 / Old: 12</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thread Count">
                  <Badge count={45} showZero color="#faad14" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ServerMonitoring;
