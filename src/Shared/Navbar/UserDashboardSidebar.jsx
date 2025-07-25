import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const UserDashboardSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = path => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center px-4 h-[60px] border-b">
          <span className="text-purple-700 text-lg font-bold">MyApp</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Link
            to="/dashboard/home"
            className={`flex items-center gap-3 px-6 py-3 font-semibold ${
              isActive('/dashboard/home')
                ? 'text-purple-700'
                : 'text-gray-700 hover:text-purple-700'
            }`}
          >
            <FaHome />
            Home
          </Link>

          <Link
            to="/dashboard/profile"
            className={`flex items-center gap-3 px-6 py-3 font-semibold ${
              isActive('/dashboard/profile')
                ? 'text-purple-700'
                : 'text-gray-700 hover:text-purple-700'
            }`}
          >
            <FaUser />
            Profile
          </Link>
        </div>

        <div className="mt-auto border-t px-6 py-4">
          <Link
            to="/logout"
            className="flex items-center gap-3 text-gray-700 font-semibold hover:text-red-600"
          >
            <FaSignOutAlt />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDashboardSidebar;
