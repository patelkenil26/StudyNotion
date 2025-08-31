import React from "react";

export default function StudentModal({
  student,
  courses,
  onClose,
}) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-4">
      <div className="relative w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-richblack-900 p-6 shadow-lg border border-richblack-700">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-richblack-200 hover:text-white text-xl sm:text-2xl"
        >
          ✕
        </button>

        {/* 🔹 Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <img
            src={student.image || "https://via.placeholder.com/120"}
            alt={`${student.firstName} ${student.lastName}`}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-richblack-700"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-richblack-5">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-sm text-richblack-200 break-all">
              {student.email}
            </p>
            <p className="text-xs text-richblack-300 mt-1">
              Joined: {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 🔹 Enrolled Courses */}
        <h3 className="text-lg font-semibold mb-3 text-richblack-5">
          Enrolled Courses
        </h3>

        {courses?.length > 0 ? (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li
                key={course._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-richblack-800 hover:bg-richblack-700 transition-all"
              >
                <img
                  src={course.thumbnail || "https://via.placeholder.com/80"}
                  alt={course.courseName}
                  className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-richblack-5 font-semibold text-sm sm:text-base">
                    {course.courseName}
                  </p>
                  <p className="text-xs sm:text-sm text-richblack-200">
                    Instructor:{" "}
                    {course.instructor
                      ? `${course.instructor.firstName || ""} ${
                          course.instructor.lastName || ""
                        }`
                      : "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-200">
                    Progress: {course.progress ?? 0}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-richblack-200 text-sm">
            No courses enrolled
          </p>
        )}
      </div>
    </div>
  );
}
