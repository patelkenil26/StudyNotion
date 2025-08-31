import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CourseTable from "./Course/CourseTable";
import CourseModal from "./Course/CourseModal";
import { getAllCourses, deleteCourse, getCourseDetails } from "../../../../services/operations/adminAPI";

export default function ManageCourses() {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 🔹 Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getAllCourses(token);
      if (res?.success) {
        setCourses(res.data);
      }
    };
    fetchCourses();
  }, [token]);

  // 🔹 Delete Course
  const handleDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const res = await getAllCourses(token);
    if (res?.success) setCourses(res.data);
    setLoading(false);
  };

  // 🔹 View Details
  const handleView = async (id) => {
    const res = await getCourseDetails(id, token);
    if (res?.success) setSelectedCourse(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold text-richblack-5">Manage Courses</h1>
      <CourseTable 
        courses={courses} 
        onView={handleView} 
        onDelete={handleDelete} 
        loading={loading}
      />
      {selectedCourse && (
        <CourseModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
    </div>
  );
}