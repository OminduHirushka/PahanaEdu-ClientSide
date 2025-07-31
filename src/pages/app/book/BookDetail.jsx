import React, { useState, useEffect } from "react";
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
  InputNumber,
  Space,
  Alert,
  Breadcrumb,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookByName } from "../../../state/book/bookAction";
import { clearBookState } from "../../../state/book/bookSlice";
import {
  getCategoryName,
  getPublisherName,
  formatBookPrice,
  getAvailabilityStatus,
} from "../../../utils/bookDetailHelpers";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const BookDetail = () => {
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} copies of book ${book.name} to cart`);
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar selectedKey="books" />
        <Content style={{ padding: "2rem", background: "#fff" }}>
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <Spin size="large" />
            <div style={{ marginTop: "1rem" }}>
              <Text>Loading book details...</Text>
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar selectedKey="books" />
        <Content style={{ padding: "2rem", background: "#fff" }}>
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
              onClick={() => navigate("/books")}
            >
              Back to Books
            </Button>
          </div>
        </Content>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="books" />

      <Content style={{ padding: "0", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
          <Breadcrumb
            style={{ marginBottom: "2rem" }}
            items={[
              {
                title: (
                  <Button
                    type="link"
                    onClick={() => navigate("/")}
                    style={{ padding: 0 }}
                  >
                    Home
                  </Button>
                ),
              },
              {
                title: (
                  <Button
                    type="link"
                    onClick={() => navigate("/books")}
                    style={{ padding: 0 }}
                  >
                    Books
                  </Button>
                ),
              },
              {
                title: book.name,
              },
            ]}
          />

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/books")}
            style={{ marginBottom: "2rem" }}
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
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x600?text=No+Image";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
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
              <div>
                <Title
                  level={1}
                  style={{ marginBottom: "1rem", color: "#333" }}
                >
                  {book.name}
                </Title>

                <div style={{ marginBottom: "1.5rem" }}>
                  <Tag
                    color="geekblue"
                    style={{ fontSize: "14px", padding: "4px 12px" }}
                  >
                    {getCategoryName(book)}
                  </Tag>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <Text strong style={{ color: "#666", fontSize: "16px" }}>
                    Publisher: {getPublisherName(book)}
                  </Text>
                  <br />
                  <Text style={{ color: "#666", fontSize: "14px" }}>
                    ISBN: {book.isbn}
                  </Text>
                  {book.pages && (
                    <>
                      <br />
                      <Text style={{ color: "#666", fontSize: "14px" }}>
                        Pages: {book.pages}
                      </Text>
                    </>
                  )}
                </div>

                <Divider />

                <div style={{ marginBottom: "2rem" }}>
                  <Title
                    level={2}
                    style={{ color: "#1890ff", marginBottom: "1rem" }}
                  >
                    {formatBookPrice(book)}
                  </Title>

                  <div style={{ marginBottom: "1rem" }}>
                    {(() => {
                      const status = getAvailabilityStatus(book);
                      return status.available ? (
                        <Space>
                          <CheckCircleOutlined
                            style={{ color: status.color }}
                          />
                          <Text
                            style={{ color: status.color, fontSize: "16px" }}
                          >
                            {status.text}
                          </Text>
                        </Space>
                      ) : (
                        <Space>
                          <CloseCircleOutlined
                            style={{ color: status.color }}
                          />
                          <Text
                            style={{ color: status.color, fontSize: "16px" }}
                          >
                            {status.text}
                          </Text>
                        </Space>
                      );
                    })()}
                  </div>
                </div>

                {book.isAvailable && (
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ marginBottom: "1rem" }}>
                      <Text strong style={{ marginRight: "1rem" }}>
                        Quantity:
                      </Text>
                      <InputNumber
                        min={1}
                        max={book.stock || 10}
                        value={quantity}
                        onChange={setQuantity}
                        style={{ width: "80px" }}
                      />
                    </div>

                    <Space size="middle" wrap>
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCart}
                        style={{ minWidth: "150px" }}
                      >
                        Add to Cart
                      </Button>
                    </Space>
                  </div>
                )}

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

      <Footer />
    </Layout>
  );
};

export default BookDetail;
