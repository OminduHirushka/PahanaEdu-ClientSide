import axios from "axios";
import {
  getBooksRequest,
  getBooksSuccess,
  getBooksFailure,
  getBookRequest,
  getBookSuccess,
  getBookFailure,
  createBookRequest,
  createBookSuccess,
  createBookFailure,
  updateBookRequest,
  updateBookSuccess,
  updateBookFailure,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailure,
} from "./bookSlice";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAllBooks = () => async (dispatch) => {
  dispatch(getBooksRequest());

  try {
    const result = await axios.get(`${baseURL}/book/`, {
      headers: getAuthHeaders(),
    });

    console.log("Books fetched successfully:", result.data);

    const booksData = {
      books: result.data.books || [],
      totalBooks: result.data.books?.length || 0,
      message: result.data.message,
    };

    dispatch(getBooksSuccess(booksData));
    return booksData;
  } catch (error) {
    console.error("Books fetch error:", error);

    toast.error("Failed to fetch books!");
    dispatch(getBooksFailure("Failed to fetch books"));
    throw error;
  }
};

export const getBookByName = (bookName) => async (dispatch) => {
  dispatch(getBookRequest());

  try {
    const result = await axios.get(
      `${baseURL}/book/name/${encodeURIComponent(bookName)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Book fetched successfully:", result.data);

    const bookData = result.data.book || result.data;
    dispatch(getBookSuccess(bookData));
    return bookData;
  } catch (error) {
    console.error("Book fetch error:", error);

    if (error.response.status === 404) {
      toast.error("Book not found!");
      dispatch(getBookFailure("Book not found"));
    } else {
      toast.error("Failed to fetch book!");
      dispatch(getBookFailure("Failed to fetch book"));
    }
    throw error;
  }
};

export const createBook = (bookData) => async (dispatch) => {
  dispatch(createBookRequest());

  try {
    const result = await axios.post(`${baseURL}/book/create-book`, bookData, {
      headers: getAuthHeaders(),
    });

    const createdBook = result.data.createdBook || result.data;

    toast.success("Book Created Successfully!");
    dispatch(createBookSuccess(createdBook));
    return createdBook;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data;

      if (typeof errorMessage === "string") {
        if (errorMessage.includes("ISBN already exists")) {
          toast.error("ISBN Already Exists!");
        } else if (errorMessage.includes("Category not found")) {
          toast.error("Category Not Found!");
        } else if (errorMessage.includes("Publisher not found")) {
          toast.error("Publisher Not Found!");
        } else {
          toast.error(`${errorMessage}`);
        }
      } else if (Array.isArray(errorMessage)) {
        const firstError = errorMessage[0];
        toast.error(`${firstError}`);
      }

      dispatch(createBookFailure(errorMessage));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(createBookFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(createBookFailure("Access denied"));
    } else {
      toast.error("Failed to create book!");
      dispatch(createBookFailure("Failed to create book"));
    }

    throw error;
  }
};

export const updateBook = (bookId, bookData) => async (dispatch) => {
  dispatch(updateBookRequest());

  try {
    const result = await axios.put(
      `${baseURL}/book/update-book/${bookId}`,
      bookData,
      {
        headers: getAuthHeaders(),
      }
    );

    const updatedBook = result.data.updatedBook || result.data;

    toast.success("Book Updated Successfully!");
    dispatch(updateBookSuccess(updatedBook));
    return updatedBook;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("Book not found!");
        dispatch(updateBookFailure("Book not found"));
      } else if (error.response.status === 401) {
        toast.error("🔐 Unauthorized!");
        dispatch(updateBookFailure("Unauthorized"));
      } else if (error.response.status === 403) {
        toast.error("🚫 Access Denied!");
        dispatch(updateBookFailure("Access denied"));
      }
    } else {
      toast.error("Failed to update book!");
      dispatch(updateBookFailure("Failed to update book"));
    }

    throw error;
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  dispatch(deleteBookRequest());

  try {
    const result = await axios.delete(`${baseURL}/book/delete-book/${bookId}`, {
      headers: getAuthHeaders(),
    });

    toast.success("Book Deleted Successfully!");
    dispatch(deleteBookSuccess(bookId));
    return { success: true, bookId, message: result.data.message };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Book not found!");
      dispatch(deleteBookFailure("Book not found"));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(deleteBookFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(deleteBookFailure("Access denied"));
    } else {
      toast.error("Failed to delete book!");
      dispatch(deleteBookFailure("Failed to delete book"));
    }

    throw error;
  }
};

export const getBooksByCategory = (category) => async (dispatch) => {
  dispatch(getBooksRequest());

  try {
    const result = await axios.get(
      `${baseURL}/book/category/${encodeURIComponent(category)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const booksData = {
      books: result.data.books || [],
      totalBooks: result.data.books?.length || 0,
      message: result.data.message,
    };

    dispatch(getBooksSuccess(booksData));
    return booksData;
  } catch (error) {
    toast.error("Failed to fetch books by category!");
    dispatch(getBooksFailure("Failed to fetch books by category"));
    throw error;
  }
};

export const getBooksByPublisher = (publisher) => async (dispatch) => {
  dispatch(getBooksRequest());

  try {
    const result = await axios.get(
      `${baseURL}/book/publisher/${encodeURIComponent(publisher)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const booksData = {
      books: result.data.books || [],
      totalBooks: result.data.books?.length || 0,
      message: result.data.message,
    };

    dispatch(getBooksSuccess(booksData));
    return booksData;
  } catch (error) {
    toast.error("Failed to fetch books by publisher!");
    dispatch(getBooksFailure("Failed to fetch books by publisher"));
    throw error;
  }
};

export const updateStock = (bookId, quantity) => async (dispatch) => {
  dispatch(updateBookRequest());

  try {
    const result = await axios.patch(
      `${baseURL}/book/update-stock/${bookId}?quantity=${quantity}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    const updatedBook = result.data.updatedBook || result.data;

    toast.success("Stock Updated Successfully!");
    dispatch(updateBookSuccess(updatedBook));
    return updatedBook;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Book not found!");
      dispatch(updateBookFailure("Book not found"));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(updateBookFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(updateBookFailure("Access denied"));
    } else {
      toast.error("Failed to update stock!");
      dispatch(updateBookFailure("Failed to update stock"));
    }

    throw error;
  }
};

export const checkISBNExists = (isbn, existingBooks = []) => {
  if (!isbn || !Array.isArray(existingBooks)) {
    return false;
  }

  return existingBooks.some(
    (book) => book.isbn && book.isbn.toLowerCase() === isbn.toLowerCase()
  );
};

export const validateBookData = (bookData, existingBooks = []) => {
  const errors = [];

  if (!bookData.name || bookData.name.trim() === "") {
    errors.push("Book name is required");
  }
  if (!bookData.isbn || bookData.isbn.trim() === "") {
    errors.push("ISBN is required");
  }
  if (!bookData.categoryName || bookData.categoryName.trim() === "") {
    errors.push("Category is required");
  }
  if (!bookData.publisherName || bookData.publisherName.trim() === "") {
    errors.push("Publisher is required");
  }
  if (!bookData.pages || bookData.pages <= 0) {
    errors.push("Pages must be a positive number");
  }

  if (bookData.isbn && checkISBNExists(bookData.isbn, existingBooks)) {
    errors.push("ISBN already exists in the system");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
