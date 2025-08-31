const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");

// Get Dashboard stats (count + revenue)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalInstructors = await User.countDocuments({
      accountType: "Instructor",
    });
    const totalCourse = await Course.countDocuments();

    // Revenur => simple : sum of all course price * students enrolled
    const courses = await Course.find({}, "price studentsEnrolled");
    let totalRevenue = 0;

    courses.forEach((course) => {
      totalRevenue += course.price * course.studentsEnrolled.length;
    });

    console.log("TOTAL STUDENT .......................", totalStudents);
    console.log("TOTAL REVENUE.......................", totalRevenue);
    console.log("TOTAL INSTRUCTORS .......................", totalInstructors);
    console.log("TOTAL COURSES .......................", totalCourse);

    return res.status(200).json({
      success: true,
      data: {
        totalCourse,
        totalInstructors,
        totalRevenue,
        totalStudents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. get monthly enrollments
exports.getMonthlyEnrollments = async (req, res) => {
  try {
    // last 12 months ka data
    const enrollments = await Course.aggregate([
      { $unwind: "$studentsEnrolled" },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("GET MONTHLY ENROLLMENTS..............", enrollments);

    return res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get top 5 courses
exports.getTopCourses = async (req, res) => {
  try {
    const topCourses = await Course.find()
      .sort({ "studentsEnrolled.length": -1 })
      .limit(5)
      .populate("instructor", "firstName lastName email");

    console.log("TOP COURSES..................", topCourses);

    return res.status(200).json({
      success: true,
      data: topCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mesaage: error.mesaage,
    });
  }
};

// get top 5 instructors
exports.getTopInstructors = async (req, res) => {
  try {
    const topInstructors = await User.aggregate([
      { $match: { accountType: "Instructor" } },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "courses",
        },
      },
      {
        $addFields: {
          totalStudents: {
            $sum: {
              $map: {
                input: "$courses",
                as: "c",
                in: { $size: "$$c.studentsEnrolled" },
              },
            },
          },
        },
      },
      { $sort: { totalStudents: -1 } },
      { $limit: 5 },
    ]);

    console.log("TOP INSTRUCTORS.............................", topInstructors);

    return res.status(200).json({
      success: true,
      data: topInstructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.mesaage,
    });
  }
};

// get recent course
exports.getRecentCourses = async (req, res) => {
  try {
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("instructor", "firstName lastName email");

    console.log("RECENT COURSES.........................", recentCourses);

    return res.status(200).json({
      success: true,
      data: recentCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.mesaage,
    });
  }
};

// get new student
exports.getNewStudents = async (req, res) => {
  try {
    const newStudents = await User.find({ accountType: "Student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email createdAt");

    console.log("NEW STUDENTS..........................", newStudents);
    return res.status(200).json({
      success: true,
      data: newStudents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.mesaage,
    });
  }
};
