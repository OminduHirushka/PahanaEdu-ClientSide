import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../../../state/publisher/publisherAction";

const { Content } = Layout;
const { Title, Text } = Typography;

const ManagerPublisher = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    publishers = [],
    isLoading = false,
    error = null,
  } = useSelector((state) => state.publisher || {});

  useEffect(() => {
    dispatch(getAllPublishers());
  }, [dispatch]);

  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      publisher.code?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddPublisher = () => {
    setEditingPublisher(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditPublisher = (publisher) => {
    setEditingPublisher(publisher);
    setIsModalVisible(true);
    form.setFieldsValue({
      code: publisher.code || "",
      name: publisher.name,
    });
  };

  const handleDeletePublisher = async (publisherId, publisherName) => {
    try {
      await dispatch(deletePublisher(publisherId));
      message.success(`Publisher "${publisherName}" deleted successfully`);
      dispatch(getAllPublishers());
    } catch (error) {
      message.error("Failed to delete publisher");
    }
  };

  const handleModalSubmit = async (values) => {
    setModalLoading(true);
    try {
      if (editingPublisher) {
        await dispatch(updatePublisher(editingPublisher.id, values));
        message.success("Publisher updated successfully");
      } else {
        await dispatch(createPublisher(values));
        message.success("Publisher created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(getAllPublishers());
    } catch (error) {
      message.error(
        editingPublisher
          ? "Failed to update publisher"
          : "Failed to create publisher"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPublisher(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 120,
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""),
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPublisher(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Publisher"
            description={`Are you sure you want to delete "${record.name}"? This will affect all books from this publisher.`}
            onConfirm={() => handleDeletePublisher(record.id, record.name)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
        <div
          style={{ background: "#fff", padding: "2rem", borderRadius: "8px" }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/manager")}
                  >
                    Back to Dashboard
                  </Button>
                  <Title level={2} style={{ margin: 0 }}>
                    Manage Publishers
                  </Title>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddPublisher}
                >
                  Add New Publisher
                </Button>
              </Col>
            </Row>
          </div>

          <Card style={{ marginBottom: "1.5rem" }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by code or name..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Text type="secondary">
                  Total: {filteredPublishers.length} publishers
                </Text>
              </Col>
            </Row>
          </Card>

          <Table
            columns={columns}
            dataSource={filteredPublishers}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} publishers`,
            }}
            scroll={{ x: 900 }}
          />

          <Modal
            title={editingPublisher ? "Edit Publisher" : "Add New Publisher"}
            open={isModalVisible}
            onCancel={handleModalCancel}
            footer={null}
            width={700}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleModalSubmit}
              style={{ marginTop: "1rem" }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Publisher Code"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Please enter publisher code",
                      },
                    ]}
                  >
                    <Input placeholder="Enter publisher code (e.g., PBL-001)" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Publisher Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter publisher name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter publisher name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={handleModalCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={modalLoading}
                  >
                    {editingPublisher ? "Update Publisher" : "Create Publisher"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default ManagerPublisher;
