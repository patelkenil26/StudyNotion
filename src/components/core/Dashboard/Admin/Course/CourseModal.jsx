import React from "react";
import { AiOutlineClose, AiFillStar } from "react-icons/ai";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

export default function CourseModal({ course, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-richblack-800 p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl text-richblack-5 shadow-2xl border border-richblack-700">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 pb-2 sm:pb-3 md:pb-4 border-b border-richblack-700">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight pr-4">
            {course.course.title}
          </h2>
          <button
            onClick={onClose}
            className="text-richblack-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <AiOutlineClose className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
          </button>
        </div>

        {/* Course Details Section */}
        <div className="mb-6 sm:mb-8">
          <p className="text-richblack-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
            {course.course.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 sm:gap-y-6 md:gap-x-12">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <AiFillStar className="text-yellow-400 text-lg sm:text-xl md:text-2xl" />
              <p className="text-richblack-200 text-sm sm:text-base md:text-lg">
                <span className="font-semibold text-richblack-5">
                  Avg Rating:
                </span>{" "}
                {course.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FaChalkboardTeacher className="text-blue-400 text-lg sm:text-xl md:text-2xl" />
              <p className="text-richblack-200 truncate text-sm sm:text-base md:text-lg">
                <span className="font-semibold text-richblack-5">
                  Instructor:
                </span>{" "}
                {course.course.instructor.firstName}{" "}
                {course.course.instructor.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Students Table Section */}
        <div className="p-4 sm:p-5 md:p-6 rounded-lg border border-richblack-700 bg-richblack-900">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <FaUserGraduate className="text-richblack-300 text-lg sm:text-xl md:text-2xl" />
            Enrolled Students{" "}
            <span className="text-richblack-400">
              ({course.totalStudents})
            </span>
          </h3>

          <div className="overflow-x-auto custom-scrollbar max-h-40 sm:max-h-52">
            {course.course.studentsEnrolled.length > 0 ? (
              <table className="min-w-full text-xs sm:text-sm md:text-base text-left">
                <thead>
                  <tr className="border-b border-richblack-600 text-richblack-300">
                    <th className="py-2 px-3 sm:py-3 sm:px-4 font-medium">Name</th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {course.course.studentsEnrolled.map((stu, index) => (
                    <tr
                      key={stu._id}
                      className="bg-richblack-900"
                    >
                      <td className="py-2 px-3 sm:py-4 sm:px-4 text-richblack-5">
                        {stu.firstName} {stu.lastName}
                      </td>
                      <td className="py-2 px-3 sm:py-4 sm:px-4 text-richblack-300">
                        {stu.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-richblack-400 italic py-4 sm:py-6 px-2 sm:px-4 text-center text-sm sm:text-base">
                No students are currently enrolled in this course.
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 sm:mt-8 md:mt-10">
          <button
            onClick={onClose}
            className="px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-yellow-200 text-richblack-900 rounded-lg font-bold shadow-md hover:bg-yellow-400 transition-colors text-sm sm:text-base md:text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
