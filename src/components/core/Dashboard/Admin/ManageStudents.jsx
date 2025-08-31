import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllStudents,
  getStudentDetails,
} from "../../../../services/operations/adminAPI";
import StudentTable from "./Student/StudentTable";
import StudentModal from "./Student/StudentModal";

export default function ManageStudents() {
  const { token } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loadingStudentId, setLoadingStudentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentCourses, setSelectedStudentCourses] = useState([]);

  // 🔹 Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await getAllStudents(token);
      if (res?.success) setStudents(res.data);
    };
    fetchStudents();
  }, [token]);

  // 🔹 View student details
  const handleViewDetails = async (studentId) => {
    setLoadingStudentId(studentId);
    try {
      const res = await getStudentDetails(studentId, token);
      if (res?.success) {
        setSelectedStudent(res.data.student || null);
        setSelectedStudentCourses(res.data.courses || []);
      }
    } catch (err) {
      console.error("getStudentDetails error:", err);
    } finally {
      setLoadingStudentId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-6 text-xl sm:text-2xl font-bold text-richblack-5">
        Manage Students
      </h1>

      <StudentTable
        students={students}
        loadingStudentId={loadingStudentId}
        handleViewDetails={handleViewDetails}
      />

      {selectedStudent && (
        <StudentModal
          
          student={selectedStudent}
          courses={selectedStudentCourses}
          onClose={() => {
            setSelectedStudent(null);
            setSelectedStudentCourses([]);
          }}
        />
      )}
    </div>
  );
}
