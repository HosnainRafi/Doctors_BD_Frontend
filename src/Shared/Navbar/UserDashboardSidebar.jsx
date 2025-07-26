import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaBookMedical } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';

const UserDashboardSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = path => location.pathname === path;

  const isUserLoggedIn = !!localStorage.getItem('userToken');
  const isDoctorLoggedIn = !!localStorage.getItem('doctorToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isUserLoggedIn) {
      localStorage.removeItem('userToken');
      navigate('/login');
    } else if (isDoctorLoggedIn) {
      localStorage.removeItem('doctorToken');
      navigate('/login/doctor');
    }
  };

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
          <span className="text-purple-700 text-lg md:text-2xl font-bold">
            CarePoint
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaHome />
            Home
          </Link>

          <Link
            to="/dashboard/user"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <MdSpaceDashboard />
            Dashboard
          </Link>

          <Link
            to="/dashboard/user/patients"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/patients')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUser />
            Patients
          </Link>

          <Link
            to="/dashboard/user/appointment"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/appointment')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaBookMedical />
            Appointment
          </Link>
        </div>

        <div className="mt-auto border-t px-6 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-700 font-semibold hover:text-red-600"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboardSidebar;
