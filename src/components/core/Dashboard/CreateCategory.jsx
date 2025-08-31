import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/operations/categoryAPI";
import { fetchCourseCategories } from "../../../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";

export default function CreateCategory() {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]); // all categories list
  const [catLoading, setCatLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [editId, setEditId] = useState(null);

  // Page load hone pr sari categories fetch kar lo
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setCatLoading(true);
    const result = await fetchCourseCategories();
    if (result) setCategories(result);
    setCatLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const { name, description } = formData;
      if (editId) {
        // update mode
        const result = await updateCategory(editId, name, description, token);
        if (result?.success) {
          toast.success("Category Updated Successfully");
          setEditId(null);
          setFormData({ name: "", description: "" });
          loadCategories();
        } else {
          toast.error(result?.message || "Failed To Update Category");
        }
      } else {
        // create mode
        const result = await createCategory(name, description, token);

        if (result?.success) {
          toast.success("Category created successfully!");
          setFormData({ name: "", description: "" });
          loadCategories(); //refresh list after creating
        } else {
          toast.error(result?.message || " Failed to create category");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("CREATE CATEGORY ERROR:", error);
    }
    setLoading(false);
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description });
  };

  const confimDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this category?"))
    //   return;
    try {
      const result = await deleteCategory(id, token);
      if (result?.success) {
        toast.success("Category deleted successfully");
        loadCategories();
      } else {
        toast.error(result?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Something went Wrong");
      console.error("DELETE CATEGORY ERROR: ", error);
    } finally {
      // delete ke baad modal close
      setConfirmationModal(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    setConfirmationModal({
      text1: "Are you sure?",
      text2: "This action will permanently delete this category",
      btn1Text: "Delete",
      btn2Text: "Cancle",
      btn1Handler: () => confimDelete(id),
      btn2Handler: () => setConfirmationModal(null), //cancle
    });
  };

  return (
    <div className="text-richblack-5 p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        {editId ? "Edit Category" : "Create Category"}
      </h1>

      {/* Card */}
      <div className="bg-richblack-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full p-3 rounded bg-richblack-700 focus:outline-none focus:ring focus:ring-yellow-50"
            />
          </div>

          {/* Category Description */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="4"
              className="w-full p-3 rounded bg-richblack-700 focus:outline-none focus:ring focus:ring-yellow-50"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right space-x-3">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData({ name: "", description: "" });
                }}
                className="px-6 py-2 bg-richblack-700 text-richblack-50 rounded font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-50 text-black rounded font-semibold hover:bg-yellow-200 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      {/* Category List */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">All Categories</h2>

        {catLoading ? (
          <p className="text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-400">No categories found</p>
        ) : (
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="p-4 bg-richblack-700 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Left side → category details */}
                <div className="flex-1">
                  <span className="font-bold text-base sm:text-lg">
                    {cat.name}
                  </span>
                  <span className="block text-sm sm:text-base text-gray-300 mt-1">
                    {cat.description}
                  </span>
                </div>

                {/* Right side → buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                  <Link
                    to={`/catalog/${encodeURIComponent(
                      cat.name
                    ).toLowerCase()}`}
                    className="w-full sm:w-auto px-4 py-2 text-center bg-yellow-50 text-black rounded font-semibold hover:bg-yellow-200 transition text-sm sm:text-base"
                  >
                    View Courses
                  </Link>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="w-full sm:w-auto px-4 py-2 text-center bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="w-full sm:w-auto px-4 py-2 text-center bg-pink-500 hover:bg-pink-600 text-white rounded font-semibold transition text-sm sm:text-base"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}
