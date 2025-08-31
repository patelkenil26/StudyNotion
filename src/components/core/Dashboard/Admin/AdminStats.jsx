import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { adminEndpoints } from "../../../../services/apis";
import { apiConnector } from "../../../../services/apiconnector";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRupeeSign,
  FaChartBar,
  FaStar,
  FaFire,
  FaUserPlus,
  FaTrophy,
} from "react-icons/fa";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

function StatCard({ title, value, icon: Icon, accent = "text-yellow-400" }) {
  return (
    <div className="bg-richblack-800 rounded-2xl p-5 shadow-md border border-richblack-700 flex flex-col items-start">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className={`text-xl ${accent}`} />}
        <p className="text-richblack-200 text-sm">{title}</p>
      </div>
      <p className={`mt-1 text-2xl font-extrabold ${accent}`}>{value}</p>
    </div>
  );
}

export default function AdminStats() {
  const { token } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const ENROLL_API =
    adminEndpoints.GET_MONTHLY_ENROLLMENTS_API ||
    adminEndpoints.GET_MONTHLLY_ENROLLMENTS_API;
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [rStats, rEnroll, rTopCourses, rTopInst, rRecent, rNewStud] =
          await Promise.all([
            apiConnector(
              "GET",
              adminEndpoints.GET_ADMIN_STATS_API,
              null,
              headers
            ),
            apiConnector("GET", ENROLL_API, null, headers),
            apiConnector(
              "GET",
              adminEndpoints.GET_TOP_COURSES_API,
              null,
              headers
            ),
            apiConnector(
              "GET",
              adminEndpoints.GET_TOP_INSTRUCTORS_API,
              null,
              headers
            ),
            apiConnector(
              "GET",
              adminEndpoints.GET_RECENT_COURSES_API,
              null,
              headers
            ),
            apiConnector(
              "GET",
              adminEndpoints.GET_NEW_STUDENTS_API,
              null,
              headers
            ),
          ]);
        if (!isMounted) return;
        setStats(rStats?.data?.data || null);
        setEnrollments(rEnroll?.data?.data || []);
        setTopCourses(rTopCourses?.data?.data || []);
        setTopInstructors(rTopInst?.data?.data || []);
        setRecentCourses(rRecent?.data?.data || []);
        setNewStudents(rNewStud?.data?.data || []);
      } catch (e) {
        console.error("ADMIN DASHBOARD FETCH ERROR:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [headers, ENROLL_API]);

  const enrollChart = useMemo(
    () =>
      (enrollments || []).map((m) => ({
        month: m.month || m.label || m._id || "",
        count: m.count ?? m.enrollments ?? m.value ?? 0,
      })),
    [enrollments]
  );

  const topCoursesChart = useMemo(
    () =>
      (topCourses || []).map((c) => ({
        name: c.title || c.courseName || c.name || "Course",
        value:
          c.enrollments ?? c.totalEnrollments ?? c.students ?? c.count ?? 0,
      })),
    [topCourses]
  );

  const topInstructorsChart = useMemo(
    () =>
      (topInstructors || []).map((i) => ({
        name:
          i.name ||
          [i.firstName, i.lastName].filter(Boolean).join(" ") ||
          "Instructor",
        value: i.students ?? i.totalStudents ?? i.count ?? 0,
      })),
    [topInstructors]
  );

  const formatINR = (num) =>
    typeof num === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(num)
      : "₹0";

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          icon={FaUsers}
          accent="text-yellow-50"
        />
        <StatCard
          title="Total Instructors"
          value={stats?.totalInstructors ?? 0}
          icon={FaChalkboardTeacher}
          accent="text-yellow-50"
        />
        <StatCard
          title="Total Courses"
          value={
            stats?.totalCourse ??
            0
          }
          icon={FaBookOpen}
          accent="text-yellow-50"
        />
        <StatCard
          title="Total Revenue"
          value={formatINR(stats?.totalRevenue ?? 0)}
          icon={FaRupeeSign}
          accent="text-yellow-50"
        />
      </div>
      <hr className="border-richblack-700" />
      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Enrollments (Area) */}
        <div className="bg-richblack-800 rounded-2xl p-5 border border-richblack-700">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaChartBar /> Monthly Enrollments
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={enrollChart}>
              <defs>
                <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorEnroll)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Top 5 Courses (Horizontal Bar) */}
        <div className="bg-richblack-800 rounded-2xl p-5 border border-richblack-700">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaStar /> Top 5 Courses
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topCoursesChart.slice(0, 5)}
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" type="category" stroke="#ccc" />
              <YAxis type="number" stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {topCoursesChart.slice(0, 5).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top Instructors (Bar Chart) */}
        <div className="bg-richblack-800 rounded-2xl p-5 border border-richblack-700 lg:col-span-2">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaTrophy /> Top 5 Instructors
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={topInstructorsChart.slice(0, 5)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <hr className="border-richblack-700" />
      {/* Bottom Row: Quick Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Added Courses */}
        <div className="bg-richblack-800 rounded-2xl p-5 border border-richblack-700">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaFire /> Recently Added Courses
          </p>
          <ul className="space-y-2">
            {(recentCourses || []).length ? (
              recentCourses.map((c) => (
                <li
                  key={c._id}
                  className="text-richblack-200 border-b border-richblack-700 pb-2"
                >
                  {c.title || c.courseName}
                  {c?.category?.name || c?.category ? (
                    <span className="text-xs text-richblack-400">
                      {" "}
                      ({c?.category?.name || c?.category})
                    </span>
                  ) : null}
                </li>
              ))
            ) : (
              <p className="text-richblack-400">No courses found.</p>
            )}
          </ul>
        </div>
        {/* Newly Registered Students */}
        <div className="bg-richblack-800 rounded-2xl p-5 border border-richblack-700">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaUserPlus /> Newly Registered Students
          </p>
          <ul className="space-y-2">
            {(newStudents || []).length ? (
              newStudents.map((s) => {
                const name =
                  s.name ||
                  [s.firstName, s.lastName].filter(Boolean).join(" ") ||
                  "Student";
                return (
                  <li
                    key={s._id}
                    className="text-richblack-200 border-b border-richblack-700 pb-2"
                  >
                    {name}{" "}
                    {s.email ? (
                      <span className="text-xs text-richblack-400">
                        ({s.email})
                      </span>
                    ) : null}
                  </li>
                );
              })
            ) : (
              <p className="text-richblack-400">No students found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
