import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaBookMedical,
  FaPrescriptionBottleAlt,
  FaCalendarCheck,
  FaBell,
  FaCommentDots,
  FaUserMd,
} from 'react-icons/fa';
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
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-40 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center gap-1 px-4 h-[60px] border-b bg-gradient-to-r from-purple-100 to-white">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            U
          </div>
          <span className="text-purple-700 text-xl font-semibold tracking-wide">
            User Dashboard
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
            to="/dashboard/user/find-all-doctor"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/find-all-doctor')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUserMd />
            Find All Doctor
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
          <Link
            to="/dashboard/user/prescriptions"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/prescriptions')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaPrescriptionBottleAlt />
            Prescriptions
          </Link>
          <Link
            to="/dashboard/user/followups"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/followups')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaCalendarCheck />
            Follow Up
          </Link>
          <Link
            to="/dashboard/user/notifications"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/notifications')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaBell />
            Notifications
          </Link>
          <Link
            to="/dashboard/user/reviews"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/reviews')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaCommentDots />
            Reviews
          </Link>
        </div>

        <div className="border-t py-3">
          <Link
            to="/dashboard/user/profile"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all duration-200 ${
              isActive('/dashboard/user/profile')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUser />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-3 font-semibold rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:pl-8'
            "
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
