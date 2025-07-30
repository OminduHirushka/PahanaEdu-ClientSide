import axios from "axios";
import {
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
} from "./publisherSlice";
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

export const getAllPublishers = () => async (dispatch) => {
  dispatch(getPublishersRequest());

  try {
    const result = await axios.get(`${baseURL}/publisher/`, {
      headers: getAuthHeaders(),
    });

    const publishersData = {
      allPublishers: result.data.allPublishers || [],
      totalPublishers: result.data.allPublishers?.length || 0,
      message: result.data.message,
    };

    dispatch(getPublishersSuccess(publishersData));
    return publishersData;
  } catch (error) {
    toast.error("Failed to fetch publishers!");
    dispatch(getPublishersFailure("Failed to fetch publishers"));
    throw error;
  }
};

export const getPublisherByCode = (publisherCode) => async (dispatch) => {
  dispatch(getPublisherRequest());

  try {
    const result = await axios.get(
      `${baseURL}/publisher/code/${encodeURIComponent(publisherCode)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const publisherData = result.data.publisherDTO || result.data;
    dispatch(getPublisherSuccess(publisherData));
    return publisherData;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Publisher not found!");
      dispatch(getPublisherFailure("Publisher not found"));
    } else {
      toast.error("Failed to fetch publisher!");
      dispatch(getPublisherFailure("Failed to fetch publisher"));
    }
    throw error;
  }
};

export const getPublisherByName = (publisherName) => async (dispatch) => {
  dispatch(getPublisherRequest());

  try {
    const result = await axios.get(
      `${baseURL}/publisher/name/${encodeURIComponent(publisherName)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const publisherData = result.data.publisherDTO || result.data;
    dispatch(getPublisherSuccess(publisherData));
    return publisherData;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Publisher not found!");
      dispatch(getPublisherFailure("Publisher not found"));
    } else {
      toast.error("Failed to fetch publisher!");
      dispatch(getPublisherFailure("Failed to fetch publisher"));
    }
    throw error;
  }
};

export const createPublisher = (publisherData) => async (dispatch) => {
  dispatch(createPublisherRequest());

  try {
    const result = await axios.post(
      `${baseURL}/publisher/create-publisher`,
      publisherData,
      {
        headers: getAuthHeaders(),
      }
    );

    const createdPublisher = result.data.createdPublisher || result.data;

    toast.success("Publisher Created Successfully!");
    dispatch(createPublisherSuccess(createdPublisher));
    return createdPublisher;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data;

      if (typeof errorMessage === "string") {
        if (errorMessage.includes("Publisher already exists")) {
          toast.error("Publisher Already Exists!");
        } else {
          toast.error(`${errorMessage}`);
        }
      } else if (Array.isArray(errorMessage)) {
        const firstError = errorMessage[0];
        toast.error(`${firstError}`);
      }

      dispatch(createPublisherFailure(errorMessage));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(createPublisherFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(createPublisherFailure("Access denied"));
    } else {
      toast.error("Failed to create publisher!");
      dispatch(createPublisherFailure("Failed to create publisher"));
    }

    throw error;
  }
};

export const updatePublisher =
  (publisherId, publisherData) => async (dispatch) => {
    dispatch(updatePublisherRequest());

    try {
      const result = await axios.put(
        `${baseURL}/publisher/update-publisher/${publisherId}`,
        publisherData,
        {
          headers: getAuthHeaders(),
        }
      );

      const updatedPublisher = result.data.updatedPublisher || result.data;

      toast.success("Publisher Updated Successfully!");
      dispatch(updatePublisherSuccess(updatedPublisher));
      return updatedPublisher;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Publisher not found!");
        dispatch(updatePublisherFailure("Publisher not found"));
      } else if (error.response && error.response.status === 401) {
        toast.error("🔐 Unauthorized!");
        dispatch(updatePublisherFailure("Unauthorized"));
      } else if (error.response && error.response.status === 403) {
        toast.error("🚫 Access Denied!");
        dispatch(updatePublisherFailure("Access denied"));
      } else {
        toast.error("Failed to update publisher!");
        dispatch(updatePublisherFailure("Failed to update publisher"));
      }

      throw error;
    }
  };

export const deletePublisher = (publisherId) => async (dispatch) => {
  dispatch(deletePublisherRequest());

  try {
    const result = await axios.delete(
      `${baseURL}/publisher/delete-publisher/${publisherId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    toast.success("Publisher Deleted Successfully!");
    dispatch(deletePublisherSuccess(publisherId));
    return { success: true, publisherId, message: result.data.message };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Publisher not found!");
      dispatch(deletePublisherFailure("Publisher not found"));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(deletePublisherFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(deletePublisherFailure("Access denied"));
    } else {
      toast.error("Failed to delete publisher!");
      dispatch(deletePublisherFailure("Failed to delete publisher"));
    }

    throw error;
  }
};

export const checkPublisherCodeExists = (
  publisherCode,
  existingPublishers = []
) => {
  if (!publisherCode || !Array.isArray(existingPublishers)) {
    return false;
  }

  return existingPublishers.some(
    (publisher) =>
      publisher.code &&
      publisher.code.toLowerCase() === publisherCode.toLowerCase()
  );
};

export const checkPublisherNameExists = (
  publisherName,
  existingPublishers = []
) => {
  if (!publisherName || !Array.isArray(existingPublishers)) {
    return false;
  }

  return existingPublishers.some(
    (publisher) =>
      publisher.name &&
      publisher.name.toLowerCase() === publisherName.toLowerCase()
  );
};

export const validatePublisherData = (
  publisherData,
  existingPublishers = []
) => {
  const errors = [];

  if (!publisherData.code || publisherData.code.trim() === "") {
    errors.push("Publisher code is required");
  }

  if (!publisherData.name || publisherData.name.trim() === "") {
    errors.push("Publisher name is required");
  }

  if (
    publisherData.code &&
    checkPublisherCodeExists(publisherData.code, existingPublishers)
  ) {
    errors.push("Publisher code already exists in the system");
  }

  if (
    publisherData.name &&
    checkPublisherNameExists(publisherData.name, existingPublishers)
  ) {
    errors.push("Publisher name already exists in the system");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
