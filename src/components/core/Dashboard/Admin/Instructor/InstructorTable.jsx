import React from "react";

export default function InstructorTable({ instructors, loading, onViewDetails }) {
  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-lg">
      {/* ---------- Desktop / Tablet Table ---------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px] lg:min-w-[800px]">
          <thead className="text-left">
            <tr className="text-xs lg:text-sm text-richblack-300 bg-richblack-900/50">
              <th className="px-3 lg:px-4 py-2 lg:py-3">Image</th>
              <th className="px-3 lg:px-4 py-2 lg:py-3">Name</th>
              <th className="px-3 lg:px-4 py-2 lg:py-3">Email</th>
              <th className="px-3 lg:px-4 py-2 lg:py-3">Date Joined</th>
              <th className="px-3 lg:px-4 py-2 lg:py-3">Total Courses</th>
              <th className="px-3 lg:px-4 py-2 lg:py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-300">
                  Loading...
                </td>
              </tr>
            ) : instructors.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No instructors found.
                </td>
              </tr>
            ) : (
              instructors.map((inst) => {
                const name =
                  inst.firstName || inst.name
                    ? `${inst.firstName || ""} ${inst.lastName || ""}`.trim()
                    : inst.name || "Instructor";
                const totalCourses = Array.isArray(inst.courses) ? inst.courses.length : 0;

                return (
                  <tr
                    key={inst._id}
                    className="border-t border-richblack-700 text-xs lg:text-sm"
                  >
                    <td className="px-3 lg:px-4 py-2 lg:py-3">
                      <img
                        src={inst.image || "/default-avatar.png"}
                        alt={name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-richblack-100">
                      {name}
                    </td>
                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-richblack-200">
                      {inst.email}
                    </td>
                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-richblack-200">
                      {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-richblack-200">
                      {totalCourses}
                    </td>
                    <td className="px-3 lg:px-4 py-2 lg:py-3">
                      <button
                        onClick={() => onViewDetails(inst._id)}
                        className="bg-yellow-100 text-richblack-900 font-semibold px-2 lg:px-3 py-1 rounded-md text-xs lg:text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Mobile Cards (xs–sm) ---------- */}
      <div className="md:hidden space-y-4 p-3">
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : instructors.length === 0 ? (
          <p className="text-center text-gray-400">No instructors found.</p>
        ) : (
          instructors.map((inst) => {
            const name =
              inst.firstName || inst.name
                ? `${inst.firstName || ""} ${inst.lastName || ""}`.trim()
                : inst.name || "Instructor";
            const totalCourses = Array.isArray(inst.courses) ? inst.courses.length : 0;

            return (
              <div
                key={inst._id}
                className="p-4 bg-richblack-900 rounded-lg border border-richblack-700 flex flex-col gap-3"
              >
                {/* Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={inst.image || "/default-avatar.png"}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-richblack-100 font-medium">{name}</p>
                    <p className="text-xs text-richblack-300">{inst.email}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="text-xs text-richblack-200 space-y-1">
                  <p>
                    <span className="font-medium">Joined:</span>{" "}
                    {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "-"}
                  </p>
                  <p>
                    <span className="font-medium">Courses:</span> {totalCourses}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => onViewDetails(inst._id)}
                  className="w-full bg-yellow-100 text-richblack-900 font-semibold py-2 rounded-md text-sm"
                >
                  View Details
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
