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
  Table,
  Image,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../../state/book/bookAction";
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

const EmployeeBooks = () => {
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
      console.log("Books data:", books[0]);
      console.log("Categories data:", categories);
      console.log("Publishers data:", publishers);
      console.log(
        "Book category:",
        books[0]?.categoryName || books[0]?.category
      );
      console.log(
        "Book publisher:",
        books[0]?.publisherName || books[0]?.publisher
      );
      console.log("Book stock:", books[0]?.quantity || books[0]?.stock);
    }
  }, [books, categories, publishers]);

  useEffect(() => {
    const filtered = filterBooks(books, searchQuery, filters);
    setFilteredBooks(filtered);
  }, [searchQuery, filters, books, categories, publishers]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCategoryChange = (value) => {
    dispatch(setFilters({ ...filters, category: value, categoryName: value }));
  };

  const handlePublisherChange = (value) => {
    dispatch(
      setFilters({ ...filters, publisher: value, publisherName: value })
    );
  };

  const handlePriceRangeChange = (value) => {
    dispatch(setFilters({ ...filters, priceRange: value }));
  };

  const handleAvailabilityChange = (value) => {
    dispatch(setFilters({ ...filters, availability: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleViewDetails = (bookName) => {
    navigate(`/employee/books/${bookName}`);
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
          src={cover || "/placeholder-book.png"}
          alt={record.name}
          width={50}
          height={60}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          fallback="/placeholder-book.png"
          preview={false}
        />
      ),
    },
    {
      title: "Book Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <Text strong style={{ fontSize: "16px" }}>
            {name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "14px" }}>
            by {record.authorName || "Unknown Author"}
          </Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName, record) => {
        const displayName = getCategoryName(record);
        return (
          <Tag color="blue" style={{ fontSize: "14px" }}>
            {displayName}
          </Tag>
        );
      },
    },
    {
      title: "Publisher",
      dataIndex: "publisherName",
      key: "publisherName",
      render: (publisherName, record) => {
        const displayName = getPublisherName(record);
        return (
          <Tag color="green" style={{ fontSize: "14px" }}>
            {displayName}
          </Tag>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
          {formatBookPrice(price)}
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => {
        const stock = quantity || record.stock || 0;
        return (
          <Tag
            color={stock > 0 ? "success" : "error"}
            style={{ fontSize: "14px" }}
          >
            {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const aStock = a.quantity || a.stock || 0;
        const bStock = b.quantity || b.stock || 0;
        return aStock - bStock;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.name)}
            size="small"
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredBooks.map((book) => (
        <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
          <Card
            hoverable
            cover={
              <div style={{ height: 200, overflow: "hidden" }}>
                <img
                  alt={book.name}
                  src={book.cover || "/placeholder-book.png"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder-book.png";
                  }}
                />
              </div>
            }
            actions={[
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(book.id)}
              >
                View Details
              </Button>,
            ]}
          >
            <Meta
              title={
                <div>
                  <Text strong style={{ fontSize: "16px" }}>
                    {book.name}
                  </Text>
                </div>
              }
              description={
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Tag color="blue" style={{ fontSize: "12px" }}>
                      {getCategoryName(book)}
                    </Tag>
                    <Tag color="green" style={{ fontSize: "12px" }}>
                      {getPublisherName(book)}
                    </Tag>
                  </div>
                  <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                    {formatBookPrice(book.price)}
                  </Text>
                  <Tag
                    color={
                      (book.quantity || book.stock || 0) > 0
                        ? "success"
                        : "error"
                    }
                    style={{ fontSize: "12px" }}
                  >
                    {(book.quantity || book.stock || 0) > 0
                      ? `In Stock (${book.quantity || book.stock || 0})`
                      : "Out of Stock"}
                  </Tag>
                </Space>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderTableView = () => (
    <Table
      columns={columns}
      dataSource={filteredBooks}
      rowKey="id"
      loading={isLoading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} books`,
      }}
      scroll={{ x: 1000 }}
    />
  );

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Title level={3} type="danger">
              Error loading books
            </Title>
            <Text>{error}</Text>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Card style={{ marginBottom: 24 }}>
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/employee/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  Books Catalog
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                >
                  Grid View
                </Button>
                <Button
                  type={viewMode === "table" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("table")}
                >
                  Table View
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search books..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Category"
                style={{ width: "100%" }}
                value={filters.category || filters.categoryName}
                onChange={handleCategoryChange}
                allowClear
              >
                {categoryOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Publisher"
                style={{ width: "100%" }}
                value={filters.publisher || filters.publisherName}
                onChange={handlePublisherChange}
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
              <Select
                placeholder="Price Range"
                style={{ width: "100%" }}
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                allowClear
              >
                <Option value="0-1000">Rs. 0 - 1,000</Option>
                <Option value="1000-2000">Rs. 1,000 - 2,000</Option>
                <Option value="2000-5000">Rs. 2,000 - 5,000</Option>
                <Option value="5000+">Rs. 5,000+</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Availability"
                style={{ width: "100%" }}
                value={filters.availability}
                onChange={handleAvailabilityChange}
                allowClear
              >
                <Option value="in-stock">In Stock</Option>
                <Option value="out-of-stock">Out of Stock</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button onClick={handleClearFilters} block>
                Clear Filters
              </Button>
            </Col>
          </Row>

          <Row style={{ marginBottom: 16 }}>
            <Col>
              <Text>
                Showing {filteredBooks.length} of {books.length} books
              </Text>
            </Col>
          </Row>
        </Card>

        <Card>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading books...</Text>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Title level={4} type="secondary">
                No books found
              </Title>
              <Text type="secondary">
                Try adjusting your search criteria or filters
              </Text>
            </div>
          ) : viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderTableView()
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default EmployeeBooks;
