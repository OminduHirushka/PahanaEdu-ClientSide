import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Typography,
  Tag,
  Select,
  Spin,
  Space,
  Popconfirm,
  message,
  Table,
  Image,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks, deleteBook } from "../../../state/book/bookAction";
import { getAllCategories } from "../../../state/category/categoryAction";
import { getAllPublishers } from "../../../state/publisher/publisherAction";
import {
  setSearchQuery,
  setFilters,
  clearFilters,
} from "../../../state/book/bookSlice";
import {
  getCategoryName,
  getPublisherName,
  formatBookPrice,
  generateCategoryOptions,
  generatePublisherOptions,
  filterBooks,
} from "../../../utils/bookHelpers";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagerBooks = () => {
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    books = [],
    isLoading = false,
    error = null,
    searchQuery = "",
    filters = {},
  } = useSelector((state) => state.book || {});

  const { categories = [] } = useSelector((state) => state.category || {});
  const { publishers = [] } = useSelector((state) => state.publisher || {});

  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllBooks());
        await dispatch(getAllCategories());
        await dispatch(getAllPublishers());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (books.length > 0) {
      console.log(books[0]?.categoryName);
      console.log(books[0]?.publisherName);
    }
  }, [books, categories, publishers]);

  useEffect(() => {
    const filtered = filterBooks(books, searchQuery, filters);
    setFilteredBooks(filtered);
  }, [searchQuery, filters, books, categories, publishers]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ ...filters, [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleDeleteBook = async (bookId, bookName) => {
    try {
      await dispatch(deleteBook(bookId));
      message.success(`Book "${bookName}" deleted successfully`);
      dispatch(getAllBooks());
    } catch (error) {
      message.error("Failed to delete book");
    }
  };

  const categoryOptions = generateCategoryOptions(books, categories);
  const publisherOptions = generatePublisherOptions(books, publishers);

  const columns = [
    {
      title: "Cover",
      dataIndex: "cover",
      key: "cover",
      width: 80,
      render: (cover, record) => (
        <Image
          width={50}
          height={70}
          src={cover || "https://via.placeholder.com/50x70?text=No+Image"}
          alt={record.name}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          fallback="https://via.placeholder.com/50x70?text=No+Image"
        />
      ),
    },
    {
      title: "Book Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "category",
      render: (_, record) => <Tag color="blue">{getCategoryName(record)}</Tag>,
    },
    {
      title: "Publisher",
      dataIndex: "publisherName",
      key: "publisher",
      render: (_, record) => (
        <Tag color="green">{getPublisherName(record)}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatBookPrice(price)}
        </Text>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock} units
        </Tag>
      ),
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
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/manager/books/${encodeURIComponent(record.name)}`)
            }
          >
            View
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(
                `/manager/books/${encodeURIComponent(record.name)}/update`
              )
            }
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Book"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDeleteBook(record.id, record.name)}
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

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "2rem", background: "#fff" }}>
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <Title level={3} style={{ color: "#ff4d4f" }}>
              Error Loading Books
            </Title>
            <Text>{error}</Text>
            <div style={{ marginTop: "1rem" }}>
              <Button type="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

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
                    Manage Books
                  </Title>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => navigate("/manager/books/create")}
                >
                  Add New Book
                </Button>
              </Col>
            </Row>
          </div>

          <Card style={{ marginBottom: "1.5rem" }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Input
                  placeholder="Search books..."
                  prefix={<SearchOutlined />}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={8} md={5}>
                <Select
                  placeholder="Filter by Category"
                  style={{ width: "100%" }}
                  value={filters.category || undefined}
                  onChange={(value) => handleFilterChange("category", value)}
                  allowClear
                >
                  {categoryOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8} md={5}>
                <Select
                  placeholder="Filter by Publisher"
                  style={{ width: "100%" }}
                  value={filters.publisher || undefined}
                  onChange={(value) => handleFilterChange("publisher", value)}
                  allowClear
                >
                  {publisherOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Space>
                  <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === "table" ? "primary" : "default"}
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </Button>
                  <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === "grid" ? "primary" : "default"}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </Col>
            </Row>
          </Card>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "5rem" }}>
              <Spin size="large" />
              <div style={{ marginTop: "1rem" }}>
                <Text>Loading books...</Text>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem" }}>
              <Title level={3} style={{ color: "#999" }}>
                No Books Found
              </Title>
              <Text>
                {searchQuery || Object.keys(filters).length > 0
                  ? "Try adjusting your search or filters"
                  : "No books available yet"}
              </Text>
              <br />
              <Button
                type="primary"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate("/manager/books/create")}
              >
                Add First Book
              </Button>
            </div>
          ) : viewMode === "table" ? (
            <Table
              columns={columns}
              dataSource={filteredBooks}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} books`,
              }}
              scroll={{ x: 800 }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredBooks.map((book) => (
                <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      book.cover ? (
                        <img
                          alt={book.name}
                          src={book.cover}
                          style={{
                            height: "300px",
                            objectFit: "cover",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x400?text=No+Image";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "300px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                        >
                          <Text style={{ color: "#999", fontSize: "14px" }}>
                            No Image Available
                          </Text>
                        </div>
                      )
                    }
                    style={{ borderRadius: "8px" }}
                    actions={[
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() =>
                          navigate(
                            `/manager/books/${encodeURIComponent(book.name)}`
                          )
                        }
                      >
                        View
                      </Button>,
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() =>
                          navigate(
                            `/manager/books/${encodeURIComponent(
                              book.name
                            )}/update`
                          )
                        }
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Delete Book"
                        description={`Are you sure you want to delete "${book.name}"?`}
                        onConfirm={() => handleDeleteBook(book.id, book.name)}
                        okText="Yes"
                        cancelText="No"
                        okType="danger"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Meta
                      title={
                        <Text
                          strong
                          style={{ color: "#333", fontSize: "1.1rem" }}
                        >
                          {book.name}
                        </Text>
                      }
                      description={
                        <>
                          <Text style={{ color: "#666" }}>
                            {getPublisherName(book)}
                          </Text>
                          <br />
                          <Tag color="geekblue">{getCategoryName(book)}</Tag>
                          <br />
                          <Text
                            strong
                            style={{ color: "#1890ff", fontSize: "1.2rem" }}
                          >
                            {formatBookPrice(book.price)}
                          </Text>
                          <br />
                          <Tag
                            color={
                              book.stock > 10
                                ? "green"
                                : book.stock > 0
                                ? "orange"
                                : "red"
                            }
                          >
                            Stock: {book.stock}
                          </Tag>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ManagerBooks;
