import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check login status
  const isUserLoggedIn = !!localStorage.getItem("userToken");
  const isDoctorLoggedIn = !!localStorage.getItem("doctorToken");

  // Optionally, get user/doctor name from localStorage
  let userName = "";
  let doctorName = "";
  try {
    if (isUserLoggedIn) {
      const userToken = localStorage.getItem("userToken");
      const userInfo = userToken
        ? JSON.parse(atob(userToken.split(".")[1]))
        : {};
      userName = userInfo.name || "";
    }
    if (isDoctorLoggedIn) {
      const doctorToken = localStorage.getItem("doctorToken");
      const doctorInfo = doctorToken
        ? JSON.parse(atob(doctorToken.split(".")[1]))
        : {};
      doctorName = doctorInfo.name || "";
    }
  } catch {
    console.log("Error occured");
  }

  const handleLogout = () => {
    if (isUserLoggedIn) {
      localStorage.removeItem("userToken");
      navigate("/login");
    } else if (isDoctorLoggedIn) {
      localStorage.removeItem("doctorToken");
      navigate("/doctor/login");
    }
  };

  const navItem = [
    { key: "home", label: "Home", path: "/" },
    {
      key: "find-doctor",
      label: "Find Doctors",
      path: "/find-doctor-by-district",
    },
    { key: "chat", label: "Chat With Assistant", path: "/chat-with-assistant" },
    { key: "contact", label: "Contact", path: "/contact" },
    { key: "about-us", label: "About Us", path: "/about-us" },
  ];

  return (
    <div className="fixed top-0 w-full left-0 z-50">
      <nav className="border-gray-200 py-2.5 bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-7xl px-4 mx-auto">
          <NavLink to="/" className="flex items-center">
            <img
              className="w-28 h-16 object-contain"
              src="https://i.postimg.cc/P5nJkfDF/image-43-removebg-preview.png"
              alt=""
            />
          </NavLink>

          <div className="flex items-center lg:order-2">
            {/* Show Dashboard and Logout if logged in */}
            {(isUserLoggedIn || isDoctorLoggedIn) && (
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold hidden md:inline">
                  {isUserLoggedIn && userName && `Hi, ${userName}`}
                  {isDoctorLoggedIn && doctorName && `Dr. ${doctorName}`}
                </span>
                <NavLink
                  to={isUserLoggedIn ? "/user/dashboard" : "/doctor/dashboard"}
                  className="ml-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
            {/* Show Login/Register if not logged in */}
            {!isUserLoggedIn && !isDoctorLoggedIn && (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="ml-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
                >
                  User Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="ml-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
                >
                  User Register
                </NavLink>
                <NavLink
                  to="/doctor/login"
                  className="ml-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition"
                >
                  Doctor Login
                </NavLink>
                <NavLink
                  to="/doctor/register"
                  className="ml-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition"
                >
                  Doctor Register
                </NavLink>
              </div>
            )}
            <button
              className="text-white text-2xl lg:hidden ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <GiHamburgerMenu />
            </button>
          </div>

          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navItem.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block py-2 pl-3 pr-4 rounded lg:p-0 ${
                        isActive
                          ? "text-white bg-purple-700 lg:bg-transparent lg:text-purple-700"
                          : "text-white lg:text-gray-300 hover:text-purple-500"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
