import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  book: null,
  isLoading: false,
  error: null,
  success: null,
  totalPages: 0,
  currentPage: 1,
  totalBooks: 0,
  searchQuery: "",
  filters: {
    category: "",
    publisher: "",
    minPrice: 0,
    maxPrice: 1000,
    availability: "all",
  },
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    getBooksRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getBooksSuccess: (state, action) => {
      state.isLoading = false;
      state.books = action.payload.books || action.payload;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.currentPage || 1;
      state.totalBooks = action.payload.totalBooks || state.books.length;
      state.error = null;
      state.success = "Books fetched successfully";
    },
    getBooksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.books = [];
    },

    getBookRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getBookSuccess: (state, action) => {
      state.isLoading = false;
      state.book = action.payload;
      state.error = null;
      state.success = "Book fetched successfully";
    },
    getBookFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.book = null;
    },

    createBookRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createBookSuccess: (state, action) => {
      state.isLoading = false;
      state.books.unshift(action.payload);
      state.totalBooks += 1;
      state.error = null;
      state.success = "Book created successfully";
    },
    createBookFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateBookRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateBookSuccess: (state, action) => {
      state.isLoading = false;
      const updatedBook = action.payload;
      const index = state.books.findIndex((book) => book.id === updatedBook.id);
      if (index !== -1) {
        state.books[index] = updatedBook;
      }
      if (state.book && state.book.id === updatedBook.id) {
        state.book = updatedBook;
      }
      state.error = null;
      state.success = "Book updated successfully";
    },
    updateBookFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteBookRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteBookSuccess: (state, action) => {
      state.isLoading = false;
      const bookId = action.payload;
      state.books = state.books.filter((book) => book.id !== bookId);
      state.totalBooks -= 1;
      if (state.book && state.book.id === bookId) {
        state.book = null;
      }
      state.error = null;
      state.success = "Book deleted successfully";
    },
    deleteBookFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    clearBookState: (state) => {
      state.book = null;
      state.error = null;
      state.success = null;
    },
    clearBooksState: (state) => {
      return initialState;
    },
  },
});

export const {
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
  setSearchQuery,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearBookState,
  clearBooksState,
} = bookSlice.actions;

export default bookSlice.reducer;
