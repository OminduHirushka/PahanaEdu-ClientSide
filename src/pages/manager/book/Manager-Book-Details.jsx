import React, { useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Spin,
  Divider,
  Space,
  Alert,
  Breadcrumb,
  Popconfirm,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookByName, deleteBook } from "../../../state/book/bookAction";
import { clearBookState } from "../../../state/book/bookSlice";
import {
  getCategoryName,
  getPublisherName,
  formatBookPrice,
  getAvailabilityStatus,
} from "../../../utils/bookDetailHelpers";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ManagerBookDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name } = useParams();

  const {
    book = null,
    isLoading = false,
    error = null,
  } = useSelector((state) => state.book || {});

  useEffect(() => {
    dispatch(clearBookState());

    if (name) {
      const decodedName = decodeURIComponent(name);
      dispatch(getBookByName(decodedName));
    }

    return () => {
      dispatch(clearBookState());
    };
  }, [dispatch, name]);

  const handleDeleteBook = async () => {
    try {
      await dispatch(deleteBook(book.id));
      message.success(`Book "${book.name}" deleted successfully`);
      navigate("/manager/books");
    } catch (error) {
      message.error("Failed to delete book");
    }
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <Spin size="large" />
            <div style={{ marginTop: "1rem" }}>
              <Text>Loading book details...</Text>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Alert
              message="Book Not Found"
              description={error || "The requested book could not be found."}
              type="error"
              showIcon
              style={{ marginBottom: "2rem" }}
            />
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/manager/books")}
            >
              Back to Books
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Breadcrumb style={{ marginBottom: "1.5rem" }}>
            <Breadcrumb.Item>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => navigate("/manager")}
              >
                Dashboard
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => navigate("/manager/books")}
              >
                Books
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{book.name}</Breadcrumb.Item>
          </Breadcrumb>

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/manager/books")}
            style={{ marginBottom: "1.5rem" }}
          >
            Back to Books
          </Button>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={10} lg={8}>
              <Card style={{ textAlign: "center" }}>
                {book.cover ? (
                  <img
                    alt={book.name}
                    src={book.cover}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "auto",
                      maxHeight: "500px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x500?text=No+Image";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      border: "2px dashed #d9d9d9",
                    }}
                  >
                    <Text style={{ color: "#999", fontSize: "16px" }}>
                      No Image Available
                    </Text>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} md={14} lg={16}>
              <div style={{ height: "100%" }}>
                <Title
                  level={1}
                  style={{ color: "#333", marginBottom: "1rem" }}
                >
                  {book.name}
                </Title>

                {book.isbn && (
                  <div style={{ marginBottom: "1rem" }}>
                    <Text strong>ISBN: </Text>
                    <Text>{book.isbn}</Text>
                  </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <Space size="middle" wrap>
                    <div>
                      <Text strong>Category: </Text>
                      <Tag color="blue" style={{ fontSize: "14px" }}>
                        {getCategoryName(book)}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Publisher: </Text>
                      <Tag color="green" style={{ fontSize: "14px" }}>
                        {getPublisherName(book)}
                      </Tag>
                    </div>
                  </Space>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
                    {formatBookPrice(book)}
                  </Title>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <Space direction="vertical" size="small">
                    <div>
                      <Text strong>Availability: </Text>
                      {(() => {
                        const availabilityStatus = getAvailabilityStatus(book);
                        return availabilityStatus.available ? (
                          <Tag icon={<CheckCircleOutlined />} color="success">
                            {availabilityStatus.text}
                          </Tag>
                        ) : (
                          <Tag icon={<CloseCircleOutlined />} color="error">
                            {availabilityStatus.text}
                          </Tag>
                        );
                      })()}
                    </div>
                  </Space>
                </div>

                {book.pages && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <Text strong>Pages: </Text>
                    <Text>{book.pages}</Text>
                  </div>
                )}

                <Divider />

                <div style={{ marginBottom: "2rem" }}>
                  <Space size="middle" wrap>
                    <Button
                      type="primary"
                      size="large"
                      icon={<EditOutlined />}
                      onClick={() =>
                        navigate(
                          `/manager/books/${encodeURIComponent(
                            book.name
                          )}/update`
                        )
                      }
                      style={{ minWidth: "120px" }}
                    >
                      Edit Book
                    </Button>

                    <Popconfirm
                      title="Delete Book"
                      description={`Are you sure you want to delete "${book.name}"? This action cannot be undone.`}
                      onConfirm={handleDeleteBook}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okType="danger"
                    >
                      <Button
                        type="primary"
                        danger
                        size="large"
                        icon={<DeleteOutlined />}
                        style={{ minWidth: "120px" }}
                      >
                        Delete Book
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>

                {book.description && (
                  <div>
                    <Title level={3} style={{ color: "#333" }}>
                      Description
                    </Title>
                    <Paragraph style={{ fontSize: "16px", lineHeight: 1.6 }}>
                      {book.description}
                    </Paragraph>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default ManagerBookDetail;
