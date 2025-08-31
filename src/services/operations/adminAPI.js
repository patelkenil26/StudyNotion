import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { adminEndpoints } from "../apis";

const {
  GET_ADMIN_STATS_API,
  GET_MONTHLY_ENROLLMENTS_API,
  GET_TOP_COURSES_API,
  GET_TOP_INSTRUCTORS_API,
  GET_RECENT_COURSES_API,
  GET_NEW_STUDENTS_API,
  GET_ALL_INSTRUCTOR_API,
  GET_INSTRUCTOR_DETAILS_API,
  GET_ALL_STUDENTS_API,
  GET_STUDENT_DETAILS_API,
  GET_ALL_COURSES_API,
  GET_COURSE_DETAILS_API,
  DELETE_COURSE_API,
} = adminEndpoints;

// Dashboard Stats
export const getAdminStats = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ADMIN_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("GET ADMIN STATES API RESPONSE............", response);

    return response?.data;
  } catch (error) {
    console.error("GET_ADMIN_STATS_API ERROR:......", error);
    toast.error("Failed to load dashboard stats");
    return null;
  }
};

export const getMonthlyEnrollments = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_MONTHLY_ENROLLMENTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (error) {
    console.log("GET MONTHLY ENROLLMENTS API ERROR......", error);
    toast.error("Failed to load monthly enrollments");
    return null;
  }
};

export const getTopCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_TOP_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_TOP_COURSES_API ERROR:", error);
    toast.error("Failed to load top courses");
    return null;
  }
};

export const getTopInstructors = async (token) => {
  try {
    const response = await apiConnector("GET", GET_TOP_INSTRUCTORS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_TOP_INSTRUCTORS_API ERROR:", error);
    toast.error("Failed to load top instructors");
    return null;
  }
};

export const getRecentCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_RECENT_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_RECENT_COURSES_API ERROR:", error);
    toast.error("Failed to load recent courses");
    return null;
  }
};

export const getNewStudents = async (token) => {
  try {
    const response = await apiConnector("GET", GET_NEW_STUDENTS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_NEW_STUDENTS_API ERROR:", error);
    toast.error("Failed to load new students");
    return null;
  }
};

// Users
export const getAllInstructors = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_ALL_INSTRUCTORS_API ERROR:", error);
    toast.error("Failed to load instructors");
    return null;
  }
};

export const getInstructorDetails = async (id, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DETAILS_API(id),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("GET_INSTRUCTOR_DETAILS_API ERROR:", error);
    toast.error("Failed to load instructor details");
    return null;
  }
};

export const getAllStudents = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_STUDENTS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_ALL_STUDENTS_API ERROR:", error);
    toast.error("Failed to load students");
    return null;
  }
};

export const getStudentDetails = async (id, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_STUDENT_DETAILS_API(id),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("GET_STUDENT_DETAILS_API ERROR:", error);
    toast.error("Failed to load student details");
    return null;
  }
};

// Courses
export const getAllCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response?.data;
  } catch (error) {
    console.error("GET_ALL_COURSES_API ERROR:", error);
    toast.error("Failed to load courses");
    return null;
  }
};

export const getCourseDetails = async (id, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_COURSE_DETAILS_API(id),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("GET_COURSE_DETAILS_API ERROR:", error);
    toast.error("Failed to load course details");
    return null;
  }
};

export const deleteCourse = async (id, token) => {
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete course");
    }

    toast.success("Course deleted successfully");
    return response?.data;
  } catch (error) {
    console.error("DELETE_COURSE_API ERROR:", error);
    toast.error(error.message);
    return null;
  }
};
