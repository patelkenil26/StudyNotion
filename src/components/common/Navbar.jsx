import { useEffect, useState } from "react"
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineClose,
} from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="group relative flex cursor-pointer items-center gap-1">
                    <p>{link.title}</p>
                    <BsChevronDown />
                    {/* dropdown */}
                    <div className="invisible absolute left-[50%] top-[150%] z-10
                      flex w-[200px] -translate-x-[50%] translate-y-0 flex-col rounded-md
                      bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all
                      duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]"
                    >
                      {loading ? (
                        <p className="text-center text-sm">Loading...</p>
                      ) : subLinks.length > 0 ? (
                        subLinks.map((sub, i) => (
                          <Link
                            to={`/catalog/${sub.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            key={i}
                          >
                            <p className="rounded-md p-2 hover:bg-richblack-50">
                              {sub.name}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-sm">No Categories</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to="/login">
                <button className="rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mr-4 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-richblack-900 p-6 md:hidden z-50">
          <ul className="flex flex-col gap-4 text-richblack-25">
            {NavbarLinks.map((link, i) => (
              <li key={i}>
                {link.title === "Catalog" ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{link.title}</p>
                    <div className="ml-2 flex flex-col gap-1">
                      {loading ? (
                        <p className="text-sm">Loading...</p>
                      ) : subLinks.length > 0 ? (
                        subLinks.map((sub, j) => (
                          <Link
                            key={j}
                            to={`/catalog/${sub.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <p className="text-sm">{sub.name}</p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm">No Categories</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            {token === null ? (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                    Log in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropdown />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
