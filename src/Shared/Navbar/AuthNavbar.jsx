import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaUserMd, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const AuthNavbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center">
          <span className="ml-2 text-black text-xl font-bold select-none">
            CarePoint
          </span>
        </NavLink>

        {/* Right: Login & Register */}
        <div className="flex items-center gap-4 relative">
          {/* Login */}
          <div
            className="relative"
            onMouseEnter={() => {
              setLoginOpen(true);
              setRegisterOpen(false);
            }}
            onMouseLeave={() => setLoginOpen(false)}
          >
            <button
              onClick={() => {
                setLoginOpen(!loginOpen);
                if (registerOpen) setRegisterOpen(false);
              }}
              className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md px-4 py-2 transition"
              aria-haspopup="true"
              aria-expanded={loginOpen}
            >
              <FaSignInAlt />
              Login
            </button>

            {loginOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50">
                <h3 className="px-4 pt-3 pb-1 text-gray-700 font-semibold border-b">
                  Login as
                </h3>
                <NavLink
                  to="/login"
                  onClick={() => setLoginOpen(false)}
                  className="px-4 py-2 text-gray-800 hover:bg-purple-100 flex items-center gap-2 rounded-md"
                >
                  <FaUser /> User
                </NavLink>
                <NavLink
                  to="/login/doctor"
                  onClick={() => setLoginOpen(false)}
                  className="px-4 py-2 text-gray-800 hover:bg-purple-100 flex items-center gap-2 rounded-md"
                >
                  <FaUserMd /> Doctor
                </NavLink>
              </div>
            )}
          </div>

          {/* Register */}
          <div
            className="relative"
            onMouseEnter={() => {
              setRegisterOpen(true);
              setLoginOpen(false);
            }}
            onMouseLeave={() => setRegisterOpen(false)}
          >
            <button
              onClick={() => {
                setRegisterOpen(!registerOpen);
                if (loginOpen) setLoginOpen(false);
              }}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md px-4 py-2 transition"
              aria-haspopup="true"
              aria-expanded={registerOpen}
            >
              <FaUserPlus />
              Register
            </button>

            {registerOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50">
                <h3 className="px-4 pt-3 pb-1 text-gray-700 font-semibold border-b">
                  Register as
                </h3>
                <NavLink
                  to="/register"
                  onClick={() => setRegisterOpen(false)}
                  className="px-4 py-2 text-gray-800 hover:bg-blue-100 flex items-center gap-2 rounded-md"
                >
                  <FaUser /> User
                </NavLink>
                <NavLink
                  to="/register/doctor"
                  onClick={() => setRegisterOpen(false)}
                  className="px-4 py-2 text-gray-800 hover:bg-blue-100 flex items-center gap-2 rounded-md"
                >
                  <FaUserMd /> Doctor
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
