const Course = require("../models/Course");
const User = require("../models/User");
const RatingAndReview = require("../models/RatingAndReview");

exports.getAllCourses = async (req, res) => {
  try {
    const { category, instructor, minRating, maxRating } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }

    if (instructor) {
      filter.instructor = instructor;
    }

    // course fetch karo
    let courses = await Course.find(filter)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .populate("ratingAndReviews");

    // Agar rating filter bhi lagani ho
    if (minRating || maxRating) {
      courses = courses.filter((course) => {
        if (!course.ratingAndReviews || course.ratingAndReviews.length === 0)
          return false;

        const avgRating =
          course.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) /
          course.ratingAndReviews.length;

        return (
          (!minRating || avgRating >= minRating) &&
          (!maxRating || avgRating <= maxRating)
        );
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Course Details (with instructor + enrolled students)
exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .populate("studentsEnrolled", "firstName lastName email")
      .populate("ratingAndReviews");

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    console.log("COURSE DETAILS ON COURSE CONTROLLERS...........",course)
    // Average rating nikalna
    let avgRating = 0;
    if (course.ratingAndReviews.length > 0) {
      avgRating =
        course.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) /
        course.ratingAndReviews.length;
    }
    console.log("AVG RATING..........",avgRating);
    return res.status(200).json({
      success: true,
      data: {
        course,
        averageRating: avgRating,
        totalStudents: course.studentsEnrolled.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

//Delete Course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // 1. Students ke courses array se hatao
    await User.updateMany(
      { _id: { $in: course.studentsEnrolled } },
      { $pull: { courses: id } }
    );

    // 2. Instructor ke courses array se hatao
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: id },
    });

    // 3. Course delete
    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
