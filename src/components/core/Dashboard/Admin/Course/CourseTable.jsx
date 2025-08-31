import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { formatDate } from "../../../../../services/formatDate";
import { FaEye } from "react-icons/fa";

export default function CourseTable({ courses, onView }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-richblack-700 shadow-md">
      <Table className="w-full">
        <Thead>
          <Tr className="bg-richblack-700 text-richblack-200">
            <Th className="px-6 py-4 text-left text-sm font-semibold uppercase">Course</Th>
            <Th className="px-6 py-4 text-left text-sm font-semibold uppercase">Instructor</Th>
            <Th className="px-6 py-4 text-left text-sm font-semibold uppercase">Students</Th>
            <Th className="px-6 py-4 text-left text-sm font-semibold uppercase">Price</Th>
            <Th className="px-6 py-4 text-left text-sm font-semibold uppercase">Created</Th>
            <Th className="px-6 py-4 text-center text-sm font-semibold uppercase">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td colSpan="6" className="py-12 text-center text-xl text-richblack-400">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="border-b sm:border-richblack-700 transition-all text-richblack-25 duration-200 sm:hover:bg-richblack-700 m-2 bg-richblack-800 sm:bg-transparent"
              >
                {/* Course Info */}
                <Td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail || "https://via.placeholder.com/120"}
                      alt={course.title}
                      className="h-16 w-24 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold text-richblack-5">{course.title}</p>
                      <p className="text-sm text-richblack-200">
                        {course.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </Td>
                {/* Instructor */}
                <Td className="px-6 py-4 text-sm text-richblack-100">
                  {course.instructor?.firstName + " " + course.instructor?.lastName || "Unknown"}
                </Td>
                {/* Students Enrolled */}
                <Td className="px-6 py-4 text-sm text-richblack-100">
                  {course.studentsEnrolled?.length || 0}
                </Td>
                {/* Price */}
                <Td className="px-6 py-4 text-sm font-semibold text-richblack-5">₹{course.price}</Td>
                {/* Date */}
                <Td className="px-6 py-4 text-sm text-richblack-100">
                  <div className="flex flex-col">
                    <span>{formatDate(course.createdAt)}</span>
                    {/* <span className="text-xs text-richblack-200">
                      {new Date(course.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span> */}
                  </div>
                </Td>
                {/* Actions */}
                <Td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(course._id)}
                      className="p-2 rounded-lg h-10 w-20 bg-yellow-100 text-richblack-900 font-bold hover:bg-yellow-300 transition-all"
                      aria-label="View Details"
                    >
                      View
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
}