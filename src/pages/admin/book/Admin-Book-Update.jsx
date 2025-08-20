import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
  Spin,
  Image,
  Divider,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateBook, getBookByName } from "../../../state/book/bookAction";
import { getAllCategories } from "../../../state/category/categoryAction";
import { getAllPublishers } from "../../../state/publisher/publisherAction";
import mediaUpload from "../../../utils/mediaUpload";
import "../../../styles/bookCreate.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminBookUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name } = useParams();

  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentBook, setCurrentBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);

  const { isLoading, error } = useSelector((state) => state.book || {});
  const { categories = [] } = useSelector((state) => state.category || {});
  const { publishers = [] } = useSelector((state) => state.publisher || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBook(true);
        const decodedBookName = decodeURIComponent(name);
        const bookResult = await dispatch(getBookByName(decodedBookName));

        if (bookResult) {
          setCurrentBook(bookResult);

          form.setFieldsValue({
            name: bookResult.name,
            isbn: bookResult.isbn,
            categoryName: bookResult.categoryName || bookResult.category?.name,
            publisherName:
              bookResult.publisherName || bookResult.publisher?.name,
            price: bookResult.price,
            stock: bookResult.stock,
            pages: bookResult.pages,
            description: bookResult.description || "",
          });

          if (bookResult.cover) {
            setCoverImageUrl(bookResult.cover);
            setPreviewUrl(bookResult.cover);
          }
        }

        await dispatch(getAllCategories());
        await dispatch(getAllPublishers());
      } catch (error) {
        console.error("Failed to fetch book data:", error);
        message.error("Failed to load book details");
        navigate("/admin/books");
      } finally {
        setLoadingBook(false);
      }
    };

    if (name) {
      fetchData();
    }
  }, [dispatch, name, form, navigate]);

  const handleCoverUpload = async (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/WebP files!");
      return;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return;
    }

    setUploadingCover(true);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const downloadURL = await mediaUpload(file);
      console.log("Upload successful, URL:", downloadURL);

      setCoverImageUrl(downloadURL);
      setCoverImage(file);
      message.success("Cover image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload cover image: " + error.message);

      URL.revokeObjectURL(preview);
      setPreviewUrl("");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleCoverUpload(file);
    }
    event.target.value = "";
  };

  const handleRemoveCover = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setCoverImage(null);
    setCoverImageUrl("");
    setPreviewUrl("");
  };

  const handleSubmit = async (values) => {
    try {
      if (!currentBook) {
        message.error("Book data not loaded yet. Please wait.");
        return;
      }

      const bookData = {
        name: values.name?.trim(),
        isbn: values.isbn?.trim(),
        categoryName: values.categoryName,
        publisherName: values.publisherName,
        price: Number(values.price),
        stock: Number(values.stock),
        pages: Number(values.pages) || 0,
        description: values.description?.trim() || "",
        cover: coverImageUrl,
        isAvailable: Number(values.stock) > 0,
      };

      if (
        !bookData.name ||
        !bookData.isbn ||
        !bookData.categoryName ||
        !bookData.publisherName ||
        !bookData.price ||
        !bookData.pages
      ) {
        message.error("Please fill in all required fields!");
        return;
      }

      console.log("Updating book data:", bookData);

      const result = await dispatch(updateBook(currentBook.id, bookData));

      if (result) {
        message.success("Book updated successfully!");
        navigate(`/admin/books/${encodeURIComponent(bookData.name)}`);
      }
    } catch (error) {
      console.error("Error updating book:", error);

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        console.log("Error response:", errorData);

        if (status === 500) {
          message.error(
            "Server error. Please check the console and try again."
          );
        } else if (status === 400) {
          message.error(errorData.message || "Invalid data provided");
        } else if (status === 401) {
          message.error("You are not authorized. Please login again.");
        } else if (status === 403) {
          message.error(
            "Access denied. You do not have permission to update books."
          );
        } else if (status === 404) {
          message.error("Book not found.");
        } else {
          message.error(
            `Failed to update book: ${errorData.message || error.message}`
          );
        }
      } else {
        message.error(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  const handleSubmitFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check all required fields!");
  };

  if (loadingBook) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Spin size="large" />
          <Text style={{ marginLeft: "16px" }}>Loading book details...</Text>
        </div>
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
          }}
        >
          <Title level={3} style={{ color: "#ff4d4f" }}>
            Book not found
          </Title>
          <Button type="primary" onClick={() => navigate("/admin/books")}>
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card style={{ marginBottom: "24px" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/books")}
              >
                Back to Books
              </Button>
              <Divider type="vertical" />
              <Title level={2} style={{ margin: 0 }}>
                Update Book: {currentBook?.name}
              </Title>
            </Space>
          </Space>
        </Card>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
            style={{ marginBottom: "24px" }}
          />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card title="Book Cover" style={{ height: "fit-content" }}>
              <div style={{ textAlign: "center" }}>
                {previewUrl ? (
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Image
                      src={previewUrl}
                      alt="Book Cover"
                      style={{
                        width: "200px",
                        height: "280px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      preview={false}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveCover}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                      }}
                      size="small"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "280px",
                      border: "2px dashed #d9d9d9",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      margin: "0 auto",
                      background: "#fafafa",
                      transition: "border-color 0.3s ease",
                    }}
                    onClick={() =>
                      document.getElementById("cover-file-input").click()
                    }
                    onMouseEnter={(e) =>
                      (e.target.style.borderColor = "#1890ff")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderColor = "#d9d9d9")
                    }
                  >
                    {uploadingCover ? (
                      <Spin />
                    ) : (
                      <PlusOutlined
                        style={{ fontSize: "24px", color: "#999" }}
                      />
                    )}
                    <div style={{ marginTop: 8, color: "#666" }}>
                      {uploadingCover ? "Uploading..." : "Upload Cover"}
                    </div>
                  </div>
                )}

                <input
                  id="cover-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                  disabled={uploadingCover}
                />

                <div style={{ marginTop: "16px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Recommended: 200x280px, JPG/PNG/WebP, Max 5MB
                  </Text>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <Button
                    icon={<UploadOutlined />}
                    disabled={uploadingCover}
                    onClick={() =>
                      document.getElementById("cover-file-input").click()
                    }
                  >
                    {uploadingCover ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card title="Book Details">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={handleSubmitFailed}
                disabled={isLoading}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24}>
                    <Title level={4}>Basic Information</Title>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Book Title"
                      rules={[
                        { required: true, message: "Please enter book title!" },
                      ]}
                    >
                      <Input placeholder="Enter book title" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="isbn"
                      label="ISBN"
                      rules={[
                        { required: true, message: "Please enter ISBN!" },
                        {
                          min: 10,
                          message: "ISBN must be at least 10 characters!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter ISBN" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="categoryName"
                      label="Category"
                      rules={[
                        {
                          required: true,
                          message: "Please select a category!",
                        },
                      ]}
                    >
                      <Select placeholder="Select category" showSearch>
                        {categories.map((category) => (
                          <Option key={category.id} value={category.name}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="publisherName"
                      label="Publisher"
                      rules={[
                        {
                          required: true,
                          message: "Please select a publisher!",
                        },
                      ]}
                    >
                      <Select placeholder="Select publisher" showSearch>
                        {publishers.map((publisher) => (
                          <Option key={publisher.id} value={publisher.name}>
                            {publisher.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Title level={4} style={{ marginTop: "24px" }}>
                      Pricing & Inventory
                    </Title>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="price"
                      label="Price (LKR)"
                      rules={[
                        { required: true, message: "Please enter price!" },
                        {
                          type: "number",
                          min: 0,
                          message: "Price must be positive!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0.00"
                        min={0}
                        precision={2}
                        formatter={(value) =>
                          `LKR ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/LKR\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="stock"
                      label="Stock Quantity"
                      rules={[
                        {
                          required: true,
                          message: "Please enter stock quantity!",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Stock must be positive!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="pages"
                      label="Number of Pages"
                      rules={[
                        {
                          required: true,
                          message: "Please enter number of pages!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        min={1}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Title level={4} style={{ marginTop: "24px" }}>
                      Description
                    </Title>
                  </Col>

                  <Col xs={24}>
                    <Form.Item name="description" label="Book Description">
                      <TextArea
                        rows={4}
                        placeholder="Enter book description..."
                        maxLength={1000}
                        showCount
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
                      <Space
                        style={{ width: "100%", justifyContent: "flex-end" }}
                      >
                        <Button
                          size="large"
                          onClick={() => navigate("/admin/books")}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          icon={<SaveOutlined />}
                          loading={isLoading}
                          disabled={uploadingCover}
                        >
                          {isLoading ? "Updating Book..." : "Update Book"}
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminBookUpdate;
