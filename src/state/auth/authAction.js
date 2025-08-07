import axios from "axios";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerRequest,
  registerSuccess,
  registerFailure,
  getUserProfileRequest,
  getUserProfileSuccess,
  getUserProfileFailure,
  logout,
} from "./authSlice";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

export const registerUser = (credentials) => async (dispatch) => {
  dispatch(registerRequest());

  try {
    const result = await axios.post(`${baseURL}/auth/register`, credentials);

    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
    }
    dispatch(registerSuccess(result.data));

    return result.data;
  } catch (error) {
    console.error("Registration error:", error);

    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data;

      console.log("Backend error message:", errorMessage);

      if (typeof errorMessage === "string") {
        if (
          errorMessage.includes("User already exists") ||
          errorMessage.includes("Account number")
        ) {
          toast.error(
            "Account number already exists!\nPlease try a different one."
          );
        } else if (errorMessage.includes("Email already exists")) {
          toast.error(
            "Email address is already registered!\nPlease use a different email."
          );
        } else if (errorMessage.includes("Contact already exists")) {
          toast.error(
            "Contact number is already registered!\nPlease use a different contact number."
          );
        } else if (errorMessage.includes("Nic already exists")) {
          toast.error(
            "NIC number is already registered!\nPlease check your NIC number."
          );
        } else {
          toast.error(`${errorMessage}`);
        }
      } else if (Array.isArray(errorMessage)) {
        const firstError = errorMessage[0];

        if (firstError.includes("Email")) {
          toast.error("Please enter a valid email address!");
        } else if (firstError.includes("Password")) {
          toast.error("Password is required and must meet requirements!");
        } else {
          toast.error(`${firstError}`);
        }
      } else {
        toast.error(
          "Registration failed!\nPlease check your input and try again."
        );
      }

      dispatch(registerFailure(errorMessage));
    } else {
      toast.error("Registration Failed!\nPlease try again.");
      dispatch(registerFailure(error.message));
    }

    throw error;
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const loginData = {
      username: credentials.email,
      password: credentials.password,
    };

    const result = await axios.post(`${baseURL}/auth/login`, loginData);

    localStorage.setItem("token", result.data.token);
    dispatch(loginSuccess(result.data));

    return result.data;
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      if (error.response.status === 401) {
        toast.error(
          "Invalid Credentials!\nPlease check your email and password."
        );
      } else if (error.response.status === 400) {
        const errorData = error.response.data;

        if (Array.isArray(errorData)) {
          toast.error(`${errorData[0]}`);
        } else {
          toast.error(`${errorData}`);
        }
      } else {
        toast.error("Login Failed!\nPlease try again.");
      }
    } else if (error.request) {
      toast.error("Network Error!\nPlease check your connection.");
    } else {
      toast.error("Login Failed!\nPlease try again.");
    }

    dispatch(loginFailure("Login Failed"));
    throw error;
  }
};

export const getCurrentUser = () => async (dispatch) => {
  dispatch(getUserProfileRequest());

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const result = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(getUserProfileSuccess(result.data));
    return result.data;
  } catch (error) {
    console.error("Get current user error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      dispatch(logout());
    }

    dispatch(getUserProfileFailure(error.response?.data || error.message));
    throw error;
  }
};
