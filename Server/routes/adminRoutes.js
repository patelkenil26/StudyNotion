const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");

const {
  getDashboardStats,
  getMonthlyEnrollments,
  getNewStudents,
  getRecentCourses,
  getTopCourses,
  getTopInstructors,
} = require("../controllers/adminController");

const {
  getAllInstructors,
  getAllStudents,
  getInstructorDetails,
  getStudentDetails,
} = require("../controllers/userController");

const {
  deleteCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/courseController");

router.get("/stats", auth, isAdmin, getDashboardStats);
router.get("/enrollments", auth, isAdmin, getMonthlyEnrollments);
router.get("/top-courses", auth, isAdmin, getTopCourses);
router.get("/top-instructors", auth, isAdmin, getTopInstructors);
router.get("/recent-courses", auth, isAdmin, getRecentCourses);
router.get("/new-students", auth, isAdmin, getNewStudents);

router.get("/instructors", auth, isAdmin, getAllInstructors);
router.get("/instructor/:id", auth, isAdmin, getInstructorDetails);
router.get("/students", auth, isAdmin, getAllStudents);
router.get("/student/:id", auth, isAdmin, getStudentDetails);

router.get("/courses", auth, isAdmin, getAllCourses);
router.get("/course/:id", auth, isAdmin, getCourseDetails);
router.delete("/course/:id", auth, isAdmin, deleteCourse);

module.exports = router;
