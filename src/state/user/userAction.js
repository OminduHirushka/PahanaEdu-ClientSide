import axios from "axios";
import {
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
} from "./userSlice";
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

export const getAllUsers = () => async (dispatch) => {
  dispatch(getUsersRequest());

  try {
    const result = await axios.get(`${baseURL}/user/`, {
      headers: getAuthHeaders(),
    });

    console.log("Users fetched successfully:", result.data);

    const usersData = {
      users: result.data.users || result.data || [],
      totalUsers: result.data.users?.length || result.data?.length || 0,
      message: result.data.message,
    };

    dispatch(getUsersSuccess(usersData));
    return usersData;
  } catch (error) {
    console.error("Users fetch error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to fetch users";
    toast.error(errorMessage);
    dispatch(getUsersFailure(errorMessage));
    throw error;
  }
};

export const getUserByAccountNumber = (accountNumber) => async (dispatch) => {
  dispatch(getUserRequest());

  try {
    const result = await axios.get(
      `${baseURL}/user/accNum/${encodeURIComponent(accountNumber)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("User fetched successfully:", result.data);

    const userData = result.data.user || result.data;
    dispatch(getUserSuccess(userData));
    return userData;
  } catch (error) {
    console.error("User fetch error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to fetch user";

    if (error.response?.status === 404) {
      toast.error("User not found!");
      dispatch(getUserFailure("User not found"));
    } else {
      toast.error(errorMessage);
      dispatch(getUserFailure(errorMessage));
    }
    throw error;
  }
};

export const createUser = (credentials) => async (dispatch) => {
  dispatch(createUserRequest());

  try {
    const result = await axios.post(`${baseURL}/auth/register`, credentials, {
      headers: getAuthHeaders(),
    });

    console.log("User created successfully:", result.data);

    const createdUser = result.data.user || result.data;

    toast.success("User created successfully!");
    dispatch(createUserSuccess(createdUser));
    return createdUser;
  } catch (error) {
    console.error("User creation error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to create user";

    if (error.response?.status === 409) {
      toast.error("User with this email or contact already exists!");
    } else {
      toast.error(errorMessage);
    }

    dispatch(createUserFailure(errorMessage));
    throw error;
  }
};

export const getCurrentLoggedUser = () => async (dispatch) => {
  dispatch(getUserRequest());

  try {
    const result = await axios.get(`${baseURL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    console.log("Current user fetched successfully:", result.data);

    const userData = result.data.user || result.data;
    dispatch(getUserSuccess(userData));
    return userData;
  } catch (error) {
    console.error("Current user fetch error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to fetch current user";

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      dispatch(getUserFailure("Session expired"));
    } else if (error.response?.status === 404) {
      toast.error("Unable to fetch user details");
      dispatch(getUserFailure("User not found"));
    } else {
      toast.error(errorMessage);
      dispatch(getUserFailure(errorMessage));
    }
    throw error;
  }
};

export const updateUser = (accountNumber, credentials) => async (dispatch) => {
  dispatch(updateUserRequest());

  try {
    const result = await axios.put(
      `${baseURL}/user/update-user/${encodeURIComponent(accountNumber)}`,
      credentials,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("User updated successfully:", result.data);

    const updatedUser = result.data.user || result.data;

    toast.success("User updated successfully!");
    dispatch(updateUserSuccess(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("User update error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to update user";

    if (error.response?.status === 404) {
      toast.error("User not found!");
    } else if (error.response?.status === 409) {
      toast.error("Email or contact number already exists!");
    } else {
      toast.error(errorMessage);
    }

    dispatch(updateUserFailure(errorMessage));
    throw error;
  }
};

export const deleteUser = (accountNumber) => async (dispatch) => {
  dispatch(deleteUserRequest());

  try {
    await axios.delete(
      `${baseURL}/user/delete-user/${encodeURIComponent(accountNumber)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("User deleted successfully");

    toast.success("User deleted successfully!");
    dispatch(deleteUserSuccess(accountNumber));
    return accountNumber;
  } catch (error) {
    console.error("User deletion error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to delete user";

    if (error.response?.status === 404) {
      toast.error("User not found!");
    } else {
      toast.error(errorMessage);
    }

    dispatch(deleteUserFailure(errorMessage));
    throw error;
  }
};

export const getUserByToken = (token) => async (dispatch) => {
  dispatch(getUserRequest());

  try {
    const result = await axios.get(`${baseURL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User profile fetched successfully:", result.data);

    const credentials = result.data.user || result.data;
    dispatch(getUserSuccess(credentials));
    return credentials;
  } catch (error) {
    console.error("User profile fetch error:", error);
    console.error("Error response:", error.response);

    const errorMessage =
      error.response?.data?.message || "Failed to fetch user profile";

    if (error.response?.status === 401) {
      toast.error("Unauthorized access!");
    } else {
      toast.error(errorMessage);
    }

    dispatch(getUserFailure(errorMessage));
    throw error;
  }
};
