import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
  user: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = "Register Success";
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload;
      state.error = null;
      state.success = "Login Success";
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      state.success = "Logout Success";
    },

    getUserProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUserProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    getUserProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  getUserProfileRequest,
  getUserProfileSuccess,
  getUserProfileFailure,
} = authSlice.actions;

export default authSlice.reducer;
