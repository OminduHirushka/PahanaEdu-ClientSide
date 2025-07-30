import axios from "axios";
import {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoryRequest,
  getCategorySuccess,
  getCategoryFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
} from "./categorySlice";
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

export const getAllCategories = () => async (dispatch) => {
  dispatch(getCategoriesRequest());

  try {
    const result = await axios.get(`${baseURL}/category/`, {
      headers: getAuthHeaders(),
    });

    const categoriesData = {
      allCategories: result.data.allCategories || [],
      totalCategories: result.data.allCategories?.length || 0,
      message: result.data.message,
    };

    dispatch(getCategoriesSuccess(categoriesData));
    return categoriesData;
  } catch (error) {
    toast.error("Failed to fetch categories!");
    dispatch(getCategoriesFailure("Failed to fetch categories"));
    throw error;
  }
};

export const getCategoryByName = (categoryName) => async (dispatch) => {
  dispatch(getCategoryRequest());

  try {
    const result = await axios.get(
      `${baseURL}/category/name/${encodeURIComponent(categoryName)}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const categoryData = result.data.category || result.data;
    dispatch(getCategorySuccess(categoryData));
    return categoryData;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Category not found!");
      dispatch(getCategoryFailure("Category not found"));
    } else {
      toast.error("Failed to fetch category!");
      dispatch(getCategoryFailure("Failed to fetch category"));
    }
    throw error;
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  dispatch(createCategoryRequest());

  try {
    const result = await axios.post(
      `${baseURL}/category/create-category`,
      categoryData,
      {
        headers: getAuthHeaders(),
      }
    );

    const createdCategory = result.data.createdCategory || result.data;

    toast.success("Category Created Successfully!");
    dispatch(createCategorySuccess(createdCategory));
    return createdCategory;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || error.response.data;

      if (typeof errorMessage === "string") {
        if (errorMessage.includes("Category already exists")) {
          toast.error("Category Already Exists!");
        } else {
          toast.error(`${errorMessage}`);
        }
      } else if (Array.isArray(errorMessage)) {
        const firstError = errorMessage[0];
        toast.error(`${firstError}`);
      }

      dispatch(createCategoryFailure(errorMessage));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(createCategoryFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(createCategoryFailure("Access denied"));
    } else {
      toast.error("Failed to create category!");
      dispatch(createCategoryFailure("Failed to create category"));
    }

    throw error;
  }
};

export const updateCategory =
  (categoryId, categoryData) => async (dispatch) => {
    dispatch(updateCategoryRequest());

    try {
      const result = await axios.put(
        `${baseURL}/category/update-category/${categoryId}`,
        categoryData,
        {
          headers: getAuthHeaders(),
        }
      );

      const updatedCategory = result.data.updatedCategory || result.data;

      toast.success("Category Updated Successfully!");
      dispatch(updateCategorySuccess(updatedCategory));
      return updatedCategory;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.message || error.response.data;

        if (typeof errorMessage === "string") {
          if (errorMessage.includes("Category already exists")) {
            toast.error("Category Already Exists!");
          } else {
            toast.error(`${errorMessage}`);
          }
        }

        dispatch(updateCategoryFailure(errorMessage));
      } else if (error.response && error.response.status === 404) {
        toast.error("Category not found!");
        dispatch(updateCategoryFailure("Category not found"));
      } else if (error.response && error.response.status === 401) {
        toast.error("🔐 Unauthorized!");
        dispatch(updateCategoryFailure("Unauthorized"));
      } else if (error.response && error.response.status === 403) {
        toast.error("🚫 Access Denied!");
        dispatch(updateCategoryFailure("Access denied"));
      } else {
        toast.error("Failed to update category!");
        dispatch(updateCategoryFailure("Failed to update category"));
      }

      throw error;
    }
  };

export const deleteCategory = (categoryId) => async (dispatch) => {
  dispatch(deleteCategoryRequest());

  try {
    const result = await axios.delete(
      `${baseURL}/category/delete-category/${categoryId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    toast.success("Category Deleted Successfully!");
    dispatch(deleteCategorySuccess(categoryId));
    return { success: true, categoryId, message: result.data.message };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Category not found!");
      dispatch(deleteCategoryFailure("Category not found"));
    } else if (error.response && error.response.status === 401) {
      toast.error("🔐 Unauthorized!");
      dispatch(deleteCategoryFailure("Unauthorized"));
    } else if (error.response && error.response.status === 403) {
      toast.error("🚫 Access Denied!");
      dispatch(deleteCategoryFailure("Access denied"));
    } else {
      toast.error("Failed to delete category!");
      dispatch(deleteCategoryFailure("Failed to delete category"));
    }

    throw error;
  }
};

export const checkCategoryExists = (categoryName, existingCategories = []) => {
  if (!categoryName || !Array.isArray(existingCategories)) {
    return false;
  }

  return existingCategories.some(
    (category) =>
      category.name &&
      category.name.toLowerCase() === categoryName.toLowerCase()
  );
};

export const validateCategoryData = (categoryData, existingCategories = []) => {
  const errors = [];

  if (!categoryData.name || categoryData.name.trim() === "") {
    errors.push("Category name is required");
  }
  
  if (
    categoryData.name &&
    checkCategoryExists(categoryData.name, existingCategories)
  ) {
    errors.push("Category name already exists in the system");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
