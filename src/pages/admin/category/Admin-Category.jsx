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
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../state/category/categoryAction";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminCategory = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    categories = [],
    isLoading = false,
    error = null,
  } = useSelector((state) => state.category || {});

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: category.name,
    });
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    try {
      await dispatch(deleteCategory(categoryId));
      message.success(`Category "${categoryName}" deleted successfully`);
      dispatch(getAllCategories());
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleModalSubmit = async (values) => {
    setModalLoading(true);
    try {
      if (editingCategory) {
        await dispatch(updateCategory(editingCategory.id, values));
        message.success("Category updated successfully");
      } else {
        await dispatch(createCategory(values));
        message.success("Category created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(getAllCategories());
    } catch (error) {
      message.error(
        editingCategory
          ? "Failed to update category"
          : "Failed to create category"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const columns = [
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
            onClick={() => handleEditCategory(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Category"
            description={`Are you sure you want to delete "${record.name}"? This will affect all books in this category.`}
            onConfirm={() => handleDeleteCategory(record.id, record.name)}
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
                    onClick={() => navigate("/admin")}
                  >
                    Back to Dashboard
                  </Button>
                  <Title level={2} style={{ margin: 0 }}>
                    Manage Categories
                  </Title>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddCategory}
                >
                  Add New Category
                </Button>
              </Col>
            </Row>
          </div>

          <Card style={{ marginBottom: "1.5rem" }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search categories..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Text type="secondary">
                  Total: {filteredCategories.length} categories
                </Text>
              </Col>
            </Row>
          </Card>

          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} categories`,
            }}
            scroll={{ x: 800 }}
          />

          <Modal
            title={editingCategory ? "Edit Category" : "Add New Category"}
            open={isModalVisible}
            onCancel={handleModalCancel}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleModalSubmit}
              style={{ marginTop: "1rem" }}
            >
              <Form.Item
                label="Category Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter category name" },
                ]}
              >
                <Input placeholder="Enter category name" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={handleModalCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={modalLoading}
                  >
                    {editingCategory ? "Update Category" : "Create Category"}
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

export default AdminCategory;
