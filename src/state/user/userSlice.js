import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  success: null,
  totalUsers: 0,
  searchQuery: "",
  filters: {
    role: "",
    status: "all",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload.users || action.payload;
      state.totalUsers = action.payload.totalUsers || state.users.length;
      state.error = null;
      state.success = "Users fetched successfully";
    },
    getUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.users = [];
    },

    getUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUserSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      state.success = "User fetched successfully";
    },
    getUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
    },

    createUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createUserSuccess: (state, action) => {
      state.isLoading = false;
      state.users.push(action.payload);
      state.totalUsers = state.users.length;
      state.error = null;
      state.success = "User created successfully";
    },
    createUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.isLoading = false;
      const index = state.users.findIndex(
        (user) => user.accountNumber === action.payload.accountNumber
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (
        state.user &&
        state.user.accountNumber === action.payload.accountNumber
      ) {
        state.user = action.payload;
      }
      state.error = null;
      state.success = "User updated successfully";
    },
    updateUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.isLoading = false;
      state.users = state.users.filter(
        (user) => user.accountNumber !== action.payload
      );
      state.totalUsers = state.users.length;
      if (state.user && state.user.accountNumber === action.payload) {
        state.user = null;
      }
      state.error = null;
      state.success = "User deleted successfully";
    },
    deleteUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.filters = {
        role: "",
        status: "all",
      };
    },
    clearUserState: (state) => {
      state.user = null;
      state.error = null;
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
});

export const {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  setSearchQuery,
  setFilters,
  clearFilters,
  clearUserState,
  clearError,
  clearSuccess,
} = userSlice.actions;

export default userSlice.reducer;
