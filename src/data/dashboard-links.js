import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Your Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
  {
    id:7,
    name:"AdminStats",
    path:"/dashboard/admin-stats",
    type:ACCOUNT_TYPE.ADMIN,
    icon:"RiAdminLine"
  },
    {
    id:8,
    name:"Instructors",
    path:"/dashboard/manage-instructors",
    type:ACCOUNT_TYPE.ADMIN,
    icon:"FaChalkboardTeacher"
  },  {
    id:9,
    name:"Students",
    path:"/dashboard/manage-students",
    type:ACCOUNT_TYPE.ADMIN,
    icon:"FaUserGraduate"
  },  {
    id:10,
    name:"Courses",
    path:"/dashboard/manage-courses",
    type:ACCOUNT_TYPE.ADMIN,
    icon:"FaBookOpen"
  },
  {
    id:11,
    name:"Category",
    path:"/dashboard/create-category",
    type:ACCOUNT_TYPE.ADMIN,
    icon:"VscAdd"
  },
  
];
