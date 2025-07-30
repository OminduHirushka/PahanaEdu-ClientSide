import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publishers: [],
  publisher: null,
  isLoading: false,
  error: null,
  success: null,
  totalPublishers: 0,
  searchQuery: "",
};

const publisherSlice = createSlice({
  name: "publisher",
  initialState,
  reducers: {
    getPublishersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPublishersSuccess: (state, action) => {
      state.isLoading = false;
      state.publishers = action.payload.allPublishers || action.payload;
      state.totalPublishers = state.publishers.length;
      state.error = null;
      state.success = "Publishers fetched successfully";
    },
    getPublishersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.publishers = [];
    },

    getPublisherRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPublisherSuccess: (state, action) => {
      state.isLoading = false;
      state.publisher = action.payload;
      state.error = null;
      state.success = "Publisher fetched successfully";
    },
    getPublisherFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.publisher = null;
    },

    createPublisherRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createPublisherSuccess: (state, action) => {
      state.isLoading = false;
      state.publishers.unshift(action.payload);
      state.totalPublishers += 1;
      state.error = null;
      state.success = "Publisher created successfully";
    },
    createPublisherFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updatePublisherRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updatePublisherSuccess: (state, action) => {
      state.isLoading = false;
      const updatedPublisher = action.payload;
      const index = state.publishers.findIndex(
        (publisher) => publisher.id === updatedPublisher.id
      );
      if (index !== -1) {
        state.publishers[index] = updatedPublisher;
      }
      if (state.publisher && state.publisher.id === updatedPublisher.id) {
        state.publisher = updatedPublisher;
      }
      state.error = null;
      state.success = "Publisher updated successfully";
    },
    updatePublisherFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deletePublisherRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deletePublisherSuccess: (state, action) => {
      state.isLoading = false;
      const publisherId = action.payload;
      state.publishers = state.publishers.filter(
        (publisher) => publisher.id !== publisherId
      );
      state.totalPublishers -= 1;
      if (state.publisher && state.publisher.id === publisherId) {
        state.publisher = null;
      }
      state.error = null;
      state.success = "Publisher deleted successfully";
    },
    deletePublisherFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    clearPublisherState: (state) => {
      state.publisher = null;
      state.error = null;
      state.success = null;
    },
    clearPublishersState: (state) => {
      return initialState;
    },
  },
});

export const {
  getPublishersRequest,
  getPublishersSuccess,
  getPublishersFailure,
  getPublisherRequest,
  getPublisherSuccess,
  getPublisherFailure,
  createPublisherRequest,
  createPublisherSuccess,
  createPublisherFailure,
  updatePublisherRequest,
  updatePublisherSuccess,
  updatePublisherFailure,
  deletePublisherRequest,
  deletePublisherSuccess,
  deletePublisherFailure,
  setSearchQuery,
  clearPublisherState,
  clearPublishersState,
} = publisherSlice.actions;

export default publisherSlice.reducer;
