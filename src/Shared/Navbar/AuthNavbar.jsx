import { useState } from 'react';
import { FaSignInAlt, FaUser, FaUserMd, FaUserPlus } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

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
            <NavLink to="/login">
              <button
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md px-4 py-2 transition"
                aria-haspopup="true"
                aria-expanded={loginOpen}
              >
                <FaSignInAlt />
                Login
              </button>
            </NavLink>
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
            <NavLink to="/register">
              <button
                
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md px-4 py-2 transition"
                aria-haspopup="true"
                aria-expanded={registerOpen}
              >
                <FaUserPlus />
                Register
              </button>
            </NavLink>

            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
