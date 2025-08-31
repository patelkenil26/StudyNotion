import * as Icons from "react-icons/vsc"
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as RiIcons from "react-icons/ri"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

const iconMap = {
 ...Icons,
  ...FaIcons,
  ...BsIcons,
  ...RiIcons
}

export default function SidebarLink({ link, iconName }) {
  const Icon = iconMap[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      // HW:What to do onClick?
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-8 py-2 text-sm font-medium ${
        // if route match thay to bg yello text ligh-yello
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}>

      {/* left side je border chhe te discribe kare che */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center gap-x-2">
        {/* Icon Goes Here */}
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}