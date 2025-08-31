import React from "react";

export default function InstructorModal({ details, loading, onClose }) {
  if (!details) return null;

  const instructor = details.instructor || {};
  const courses = details.courses || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl md:max-h-[90vh] max-h-full overflow-y-auto bg-richblack-900 border border-richblack-700 rounded-xl p-4 sm:p-6 z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={instructor.image || "/default-avatar.png"}
              alt={instructor.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <h2 className="text-lg sm:text-xl font-semibold">
              {instructor.name ||
                `${instructor.firstName || ""} ${instructor.lastName || ""}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="self-end sm:self-auto text-richblack-300 bg-richblack-800 px-3 py-1 rounded text-sm"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading details...</p>
        ) : (
          <>
            {/* Instructor Info */}
            <div className="space-y-2 mb-4 text-richblack-200 text-sm sm:text-base">
              <p>
                <strong>Email:</strong> {instructor.email || "-"}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(
                  instructor.joinedAt || instructor.createdAt || Date.now()
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Courses */}
            <div>
              <h3 className="font-semibold mb-2">Courses</h3>
              {Array.isArray(courses) && courses.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-auto">
                  {courses.map((c) => (
                    <li
                      key={c._id}
                      className="p-3 bg-richblack-800 border border-richblack-700 rounded-md flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <img
                        src={c.thumbnail || "/default-thumbnail.png"}
                        alt={c.courseName}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-richblack-100 font-medium">
                          {c.courseName || c.title}
                        </div>
                        <div className="text-xs sm:text-sm text-richblack-300">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-richblack-200">
                        Students:{" "}
                        <span className="font-semibold">
                          {c.studentsCount ??
                            c.studentsEnrolled?.length ??
                            c.students ??
                            0}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-richblack-400">
                  No courses found for this instructor.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
