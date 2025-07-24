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
  InputNumber,
  Switch,
  Tree
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MenuOutlined,
  FileOutlined,
  FolderOutlined,
  LinkOutlined,
  EyeOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { systemAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await systemAPI.getMenus();
      if (response.data.code === 200) {
        const menuData = response.data.data || [];
        setMenus(menuData);
        // Auto expand top level menus
        const topLevelKeys = menuData.filter(m => m.parentId === 0).map(m => m.menuId.toString());
        setExpandedKeys(topLevelKeys);
      }
    } catch (error) {
      message.error('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (parentMenu = null) => {
    setModalType('add');
    setSelectedMenu(null);
    form.resetFields();
    form.setFieldsValue({
      parentId: parentMenu ? parentMenu.menuId : 0,
      menuType: 'M',
      visible: '0',
      status: '0',
      orderNum: 0,
      isFrame: '1',
      isCache: '0',
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedMenu(record);
    form.setFieldsValue({
      ...record,
      parentId: record.parentId === 0 ? undefined : record.parentId,
      visible: record.visible.toString(),
      status: record.status.toString(),
      isFrame: record.isFrame ? record.isFrame.toString() : '1',
      isCache: record.isCache ? record.isCache.toString() : '0',
    });
    setModalVisible(true);
  };

  const handleDelete = async (menuId) => {
    try {
      const response = await systemAPI.deleteMenu(menuId);
      if (response.data.code === 200) {
        message.success('Menu deleted successfully');
        fetchMenus();
      } else {
        message.error(response.data.msg || 'Failed to delete menu');
      }
    } catch (error) {
      message.error('Failed to delete menu');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const menuData = {
        ...values,
        menuId: modalType === 'edit' ? selectedMenu.menuId : undefined,
        parentId: values.parentId || 0,
        visible: values.visible.toString(),
        status: values.status.toString(),
        isFrame: values.isFrame ? values.isFrame.toString() : '1',
        isCache: values.isCache ? values.isCache.toString() : '0',
      };

      let response;
      if (modalType === 'add') {
        response = await systemAPI.createMenu(menuData);
      } else {
        response = await systemAPI.updateMenu(menuData);
      }

      if (response.data.code === 200) {
        message.success(`Menu ${modalType === 'add' ? 'created' : 'updated'} successfully`);
        setModalVisible(false);
        fetchMenus();
      } else {
        message.error(response.data.msg || `Failed to ${modalType} menu`);
      }
    } catch (error) {
      message.error(`Failed to ${modalType} menu`);
    }
  };

  const buildTreeData = (menus, parentId = 0) => {
    return menus
      .filter(menu => menu.parentId === parentId)
      .sort((a, b) => a.orderNum - b.orderNum)
      .map(menu => ({
        title: menu.menuName,
        value: menu.menuId,
        key: menu.menuId,
        children: buildTreeData(menus, menu.menuId),
      }));
  };

  const buildTableData = (menus, parentId = 0, level = 0) => {
    const result = [];
    const children = menus
      .filter(menu => menu.parentId === parentId)
      .sort((a, b) => a.orderNum - b.orderNum);

    children.forEach(menu => {
      result.push({
        ...menu,
        level,
        key: menu.menuId,
      });
      result.push(...buildTableData(menus, menu.menuId, level + 1));
    });

    return result;
  };

  const getMenuIcon = (menuType) => {
    switch (menuType) {
      case 'M': return <FolderOutlined style={{ color: '#1890ff' }} />;
      case 'C': return <FileOutlined style={{ color: '#52c41a' }} />;
      case 'F': return <ApiOutlined style={{ color: '#faad14' }} />;
      default: return <MenuOutlined />;
    }
  };

  const filteredMenus = searchValue
    ? menus.filter(menu => 
        menu.menuName.toLowerCase().includes(searchValue.toLowerCase()) ||
        (menu.path && menu.path.toLowerCase().includes(searchValue.toLowerCase()))
      )
    : menus;

  const tableData = buildTableData(filteredMenus);

  const columns = [
    {
      title: 'Menu Name',
      dataIndex: 'menuName',
      key: 'menuName',
      render: (text, record) => (
        <div style={{ paddingLeft: record.level * 24 }}>
          <Space>
            {getMenuIcon(record.menuType)}
            {text}
          </Space>
        </div>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => icon ? <i className={`fa ${icon}`} /> : '-',
    },
    {
      title: 'Order',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 80,
      sorter: (a, b) => a.orderNum - b.orderNum,
    },
    {
      title: 'Permissions',
      dataIndex: 'perms',
      key: 'perms',
      render: (perms) => perms ? <Tag color="blue">{perms}</Tag> : '-',
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
      render: (component) => component || '-',
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
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => handleAdd(record)}
            size="small"
          >
            Add
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
            title="Delete Menu"
            description="Are you sure you want to delete this menu and all its sub-menus?"
            onConfirm={() => handleDelete(record.menuId)}
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

  const menuTypeOptions = [
    { label: 'Directory', value: 'M' },
    { label: 'Menu', value: 'C' },
    { label: 'Button', value: 'F' },
  ];

  return (
    <div>
      <Card title="Menu Management" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col span={8}>
            <Search
              placeholder="Search menus"
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
                onClick={() => handleAdd()}
              >
                Add Menu
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchMenus}
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
          dataSource={tableData}
          rowKey="menuId"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={modalType === 'add' ? 'Add Menu' : 'Edit Menu'}
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
            menuType: 'M',
            visible: '0',
            status: '0',
            orderNum: 0,
            isFrame: '1',
            isCache: '0',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="Parent Menu"
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={buildTreeData(menus)}
                  placeholder="Select parent menu (optional)"
                  treeDefaultExpandAll
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="menuType"
                label="Menu Type"
                rules={[{ required: true, message: 'Please select menu type!' }]}
              >
                <Select options={menuTypeOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="menuName"
                label="Menu Name"
                rules={[
                  { required: true, message: 'Please input menu name!' },
                  { min: 2, max: 50, message: 'Menu name must be 2-50 characters!' },
                ]}
              >
                <Input placeholder="Enter menu name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orderNum"
                label="Display Order"
                rules={[{ required: true, message: 'Please input display order!' }]}
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

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.menuType !== currentValues.menuType
            }
          >
            {({ getFieldValue }) => {
              const menuType = getFieldValue('menuType');
              
              return (
                <>
                  {(menuType === 'C' || menuType === 'M') && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="icon"
                          label="Menu Icon"
                        >
                          <Input placeholder="Enter icon class (e.g., fa-user)" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="path"
                          label="Route Path"
                          rules={menuType === 'C' ? [
                            { required: true, message: 'Please input route path!' }
                          ] : []}
                        >
                          <Input placeholder="Enter route path" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {menuType === 'C' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="component"
                          label="Component Path"
                        >
                          <Input placeholder="Enter component path" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="query"
                          label="Route Parameters"
                        >
                          <Input placeholder="Enter route parameters" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {(menuType === 'C' || menuType === 'F') && (
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="perms"
                          label="Permission Identifier"
                        >
                          <Input placeholder="Enter permission identifier (e.g., system:user:list)" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {menuType === 'C' && (
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="isFrame"
                          label="External Link"
                          valuePropName="checked"
                        >
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            onChange={(checked) => 
                              form.setFieldsValue({ isFrame: checked ? '0' : '1' })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="isCache"
                          label="Cache"
                          valuePropName="checked"
                        >
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            onChange={(checked) => 
                              form.setFieldsValue({ isCache: checked ? '0' : '1' })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="visible"
                          label="Visible"
                          valuePropName="checked"
                        >
                          <Switch
                            checkedChildren="Show"
                            unCheckedChildren="Hide"
                            onChange={(checked) => 
                              form.setFieldsValue({ visible: checked ? '0' : '1' })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </>
              );
            }}
          </Form.Item>

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
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
