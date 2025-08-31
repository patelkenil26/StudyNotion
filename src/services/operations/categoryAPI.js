import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { categories } from "../apis";

const { CREATE_CATEGORY_API, UPDATE_CATEGORY_API, DELETE_CATEGORY_API } =
  categories;

// Create Category API Call
export const createCategory = async (name, description, token) => {
  let result = null;
  try {
    console.log("DBG token ==> ", token);
    const response = await apiConnector(
      "POST",
      CREATE_CATEGORY_API,
      { name, description }, // body
      {
        Authorization: `Bearer ${token}`, // auth required hai
      }
    );
    console.log("CREATE_CATEGORY_API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Create Category");
    }

    toast.success("Category Created Successfully");
    result = response?.data;
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

export const updateCategory = async (categoryId, name, description, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_CATEGORY_API,
      { categoryId, name, description },
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Update Category");
    }

    toast.success("Category Update Successfully");
    result = response?.data;
  } catch (error) {
    console.log("UPDATE CATEGORY API ERROR......", error);
    toast.error(error.message);
  }
  return result;
};

// Delete Category
export const deleteCategory = async (categoryId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_CATEGORY_API,
      { categoryId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete Category");
    }

    toast.success("Category Deleted Successfully");
    result = response?.data;
  } catch (error) {
    console.log("DELETE CATEGOYR API ERROR........", error);
    toast.error(error.message);
  }
  return result;
};
