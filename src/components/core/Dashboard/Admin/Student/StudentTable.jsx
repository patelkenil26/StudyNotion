import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

export default function StudentTable({
  students,
  loadingStudentId,
  handleViewDetails,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-richblack-800">
      <Table className="w-full">
        <Thead className="hidden sm:table-header-group">
          <Tr className="bg-richblack-800 text-richblack-100">
            <Th className="px-4 py-3 text-left text-sm font-semibold uppercase">
              Profile
            </Th>
            <Th className="px-4 py-3 text-left text-sm font-semibold uppercase">
              Email
            </Th>
            <Th className="px-4 py-3 text-left text-sm font-semibold uppercase">
              Joined At
            </Th>
            <Th className="px-4 py-3 text-center text-sm font-semibold uppercase">
              Action
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {students?.length === 0 ? (
            <Tr>
              <Td
                colSpan="4"
                className="py-10 text-center text-lg sm:text-2xl font-medium text-richblack-100"
              >
                No students found
              </Td>
            </Tr>
          ) : (
            students.map((student, idx) => (
              <Tr
                key={student._id}
                className={`block sm:table-row mb-4 sm:mb-0 ${
                  idx % 2 === 0 ? "bg-richblack-700/40" : "bg-richblack-800/40"
                } sm:hover:bg-richblack-700 rounded-lg sm:rounded-none m-2 `}
              >
                {/* Profile */}
                <Td className="block sm:table-cell text-richblack-50 px-4 py-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={
                        student.image || "https://via.placeholder.com/150"
                      }
                      alt={student.firstName}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-richblack-700"
                    />
                    <p className="text-sm sm:text-base font-semibold text-richblack-5">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                </Td>

                {/* Email */}
                <Td className="block sm:table-cell px-4 py-2 sm:py-3 text-xs sm:text-sm text-richblack-100 break-all">
                  {student.email}
                </Td>

                {/* Joined Date */}
                <Td className="block sm:table-cell px-4 py-2 sm:py-3 text-xs sm:text-sm text-richblack-100">
                  {new Date(student.createdAt).toLocaleDateString()}
                </Td>

                {/* Action */}
                <Td className="block sm:table-cell px-4 py-3 text-center text-richblack-50">
                  <button
                    disabled={loadingStudentId === student._id}
                    onClick={() => handleViewDetails(student._id)}
                    className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-yellow-100 text-black hover:bg-yellow-200 transition-all"
                  >
                    {loadingStudentId === student._id
                      ? "Loading..."
                      : "View Details"}
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  )
}
