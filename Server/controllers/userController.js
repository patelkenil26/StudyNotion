const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");

// Get All Instructors
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ accountType: "Instructor" }).select(
      "firstName lastName email createdAt courses image"
    );

    return res.status(200).json({
      success: true,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get Instructors Details
exports.getInstructorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id not found at Instructor Details",
      });
    }

    const instructor = await User.findById(id)
      .select("firstName lastName email createdAt image")
      .populate({
        path: "courses",
        select: "courseName createdAt studentsEnrolled thumbnail",
      });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor Not Found",
      });
    }

    //   har course ke student count nikalna
    const courseData = instructor.courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      studentsCount: course.studentsEnrolled.length,
      createdAt: course.createdAt,
      thumbnail:course.thumbnail
    }));

    return res.status(200).json({
      success: true,
      data: {
        instructor: {
          _id: instructor._id,
          name: instructor.firstName + " " + instructor.lastName,
          email: instructor.email,
          joinedAt: instructor.createdAt,
          image:instructor.image,
        },
        courses: courseData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ accountType: "Student" })
      .select("firstName lastName email createdAt courses image")
      .populate("courses", "courseName");

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Student Details
// Get Student Details (improved)
exports.getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // student basic details + enrolled courses
    const student = await User.findById(id)
      .select("firstName lastName email createdAt courses image")
      .populate({
        path: "courses",
        populate: { path: "instructor", select: "firstName lastName email" },
      });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "student not found" });
    }

    // fetch progress for this student
    const progressData = await CourseProgress.find({ userId: id }).populate({
      path: "courseID",
      populate: {
        path: "courseContent", // sections
        populate: {
          path: "subSection", // subsections (actual videos)
        },
      },
    });

    // make a map of course progress { courseId: percentage }
    const progressMap = {};
    progressData.forEach((p) => {
      const courseIdStr = String(p.courseID._id);

      // total videos = sum of all subsections inside all sections
      let totalVideos = 0;
      if (Array.isArray(p.courseID.courseContent)) {
        p.courseID.courseContent.forEach((section) => {
          if (Array.isArray(section.subSection)) {
            totalVideos += section.subSection.length;
          }
        });
      }

      const completed = Array.isArray(p.completedVideos)
        ? p.completedVideos.length
        : 0;

      progressMap[courseIdStr] =
        totalVideos > 0 ? Math.floor((completed / totalVideos) * 100) : 0;
    });

    // final response courses data
    const courseData = student.courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName || course.title,
      thumbnail: course.thumbnail || null,
      instructor: course.instructor
        ? {
            _id: course.instructor._id,
            firstName: course.instructor.firstName,
            lastName: course.instructor.lastName,
            email: course.instructor.email,
          }
        : null,
      progress: progressMap[String(course._id)] ?? 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          createdAt: student.createdAt,
          image: student.image,
        },
        courses: courseData,
      },
    });
  } catch (error) {
    console.error("getStudentDetails error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
