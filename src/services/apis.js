const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

// STUDENTS ENDPOINTS
// export const studentEndpoints = {
//   COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
//   COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
//   SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
// };

export const studentEndpoints = {
  STRIPE_PAYMENT_SESSION: BASE_URL + "/payment/createStripePaymentSession",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
  UPDATE_CATEGORY_API: BASE_URL + "/course/updateCategory",
  DELETE_CATEGORY_API: BASE_URL + "/course/deleteCategory",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// ADMIN PAGE API
export const adminEndpoints = {
  //  DASHBOARD STATS
  GET_ADMIN_STATS_API: BASE_URL + "/admin/stats",
  GET_MONTHLLY_ENROLLMENTS_API: BASE_URL + "/admin/enrollments",
  GET_TOP_COURSES_API: BASE_URL + "/admin/top-courses",
  GET_TOP_INSTRUCTORS_API: BASE_URL + "/admin/top-instructors",
  GET_RECENT_COURSES_API: BASE_URL + "/admin/recent-courses",
  GET_NEW_STUDENTS_API: BASE_URL + "/admin/new-students",

  // USER
  GET_ALL_INSTRUCTOR_API: BASE_URL + "/admin/instructors",
  GET_INSTRUCTOR_DETAILS_API: (id) => BASE_URL + `/admin/instructor/${id}`,
  GET_ALL_STUDENTS_API: BASE_URL + "/admin/students",
  GET_STUDENT_DETAILS_API: (id) => BASE_URL + `/admin/student/${id}`,

  // COURSES
  GET_ALL_COURSES_API: BASE_URL + "/admin/courses",
  GET_COURSE_DETAILS_API: (id) => BASE_URL + `/admin/course/${id}`,
  DELETE_COURSE_API: (id) => BASE_URL + `/admin/course/${id}`,
};
