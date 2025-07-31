import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Divider,
  Typography,
  Tag,
  Select,
  Spin,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../state/book/bookAction";
import { getAllCategories } from "../../state/category/categoryAction";
import { getAllPublishers } from "../../state/publisher/publisherAction";
import {
  setSearchQuery,
  setFilters,
  clearFilters,
} from "../../state/book/bookSlice";
import {
  getCategoryName,
  getPublisherName,
  formatBookPrice,
  generateCategoryOptions,
  generatePublisherOptions,
  filterBooks,
} from "../../utils/bookHelpers";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const BooksPage = () => {
  const [viewMode, setViewMode] = useState("grid");
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
    console.log("Books data:", books);
    console.log("Sample book structure:", books[0]);
    console.log("Categories data:", categories);
    console.log("Publishers data:", publishers);
    if (books.length > 0) {
      console.log("Sample book categoryName:", books[0]?.categoryName);
      console.log("Sample book publisherName:", books[0]?.publisherName);
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
    dispatch(setFilters({ ...filters, category: value }));
  };

  const handlePublisherChange = (value) => {
    dispatch(setFilters({ ...filters, publisher: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const categoryOptions = generateCategoryOptions(books, categories);
  const publisherOptions = generatePublisherOptions(books, publishers);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="books" />

      <Content style={{ padding: "0", background: "#fff" }}>
        <div
          style={{
            background: "#f0f2f5",
            padding: "2rem 0",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 2rem",
            }}
          >
            <Title level={2} style={{ color: "#333", marginBottom: "0.5rem" }}>
              Our Book Collection
            </Title>
            <Text style={{ color: "#666", fontSize: "1.1rem" }}>
              Browse through our extensive collection of books
            </Text>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1, minWidth: "300px" }}>
              <Input
                size="large"
                placeholder="Search books by title..."
                prefix={<SearchOutlined style={{ color: "#666" }} />}
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  color: "#333",
                  fontSize: "1rem",
                }}
                allowClear
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Text strong style={{ color: "#333", fontSize: "1rem" }}>
                  Category:
                </Text>
                <Select
                  value={filters.category || "all"}
                  onChange={handleCategoryChange}
                  style={{ width: "150px" }}
                  loading={isLoading}
                >
                  {categoryOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Text strong style={{ color: "#333", fontSize: "1rem" }}>
                  Publisher:
                </Text>
                <Select
                  value={filters.publisher || "all"}
                  onChange={handlePublisherChange}
                  style={{ width: "200px" }}
                  loading={isLoading}
                >
                  {publisherOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                  style={{ marginRight: "0.5rem" }}
                >
                  Grid
                </Button>
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: "#f0f0f0" }} />

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                backgroundColor: "#fff2f0",
                borderRadius: "8px",
                border: "1px solid #ffccc7",
              }}
            >
              <Title
                level={3}
                style={{ color: "#ff4d4f", marginBottom: "1rem" }}
              >
                Error Loading Books
              </Title>
              <Text style={{ color: "#666", fontSize: "1rem" }}>{error}</Text>
              <Button
                type="primary"
                style={{ marginTop: "1rem" }}
                onClick={() => dispatch(getAllBooks())}
              >
                Retry
              </Button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Title level={3} style={{ color: "#333", marginBottom: "1rem" }}>
                No books found
              </Title>
              <Text style={{ color: "#666", fontSize: "1rem" }}>
                Try adjusting your search or filter criteria
              </Text>
              <Button
                type="primary"
                style={{ marginTop: "1rem" }}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
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
                    onClick={() =>
                      navigate(`/books/${encodeURIComponent(book.name)}`)
                    }
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
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  style={{
                    marginBottom: "1.5rem",
                    borderRadius: "8px",
                  }}
                  hoverable
                  onClick={() =>
                    navigate(`/books/${encodeURIComponent(book.name)}`)
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8} md={6}>
                      {book.cover ? (
                        <img
                          alt={book.name}
                          src={book.cover}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x400?text=No+Image";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                          }}
                        >
                          <Text style={{ color: "#999", fontSize: "14px" }}>
                            No Image Available
                          </Text>
                        </div>
                      )}
                    </Col>
                    <Col xs={24} sm={16} md={12}>
                      <Title level={4} style={{ color: "#333" }}>
                        {book.name}
                      </Title>
                      <Text strong style={{ color: "#666" }}>
                        {getPublisherName(book)}
                      </Text>
                      <div style={{ margin: "0.5rem 0" }}>
                        <Tag color="geekblue">{getCategoryName(book)}</Tag>
                      </div>
                      <Text
                        strong
                        style={{ color: "#1890ff", fontSize: "1.2rem" }}
                      >
                        {formatBookPrice(book.price)}
                      </Text>
                      <Text
                        style={{
                          color: "#666",
                          lineHeight: 1.6,
                          display: "block",
                          marginTop: "0.5rem",
                        }}
                      >
                        ISBN: {book.isbn}
                      </Text>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    ></Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default BooksPage;
