import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaFilePrescription,
  FaRegCalendarCheck,
  FaRegClock,
  FaCalendarCheck,
  FaUserInjured,
  FaStar,
  FaMoneyBillWave,
  FaUserCircle,
} from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';

const DoctorDashboardSidebar = ({ isOpen, onClose }) => {
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
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-40 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center gap-1 px-4 h-[60px] border-b bg-gradient-to-r from-purple-100 to-white">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            D
          </div>
          <span className="text-purple-700 text-xl font-semibold tracking-wide">
            Doctor Dashboard
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaHome />
            Home
          </Link>

          <Link
            to="/dashboard/doctor"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <MdSpaceDashboard />
            Dashboard
          </Link>

          <Link
            to="/dashboard/doctor/appointment"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/appointment')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUser />
            Appointment
          </Link>

          <Link
            to="/dashboard/doctor/prescriptions"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/prescriptions')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaFilePrescription />
            Prescriptions
          </Link>

          <Link
            to="/dashboard/doctor/followups"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/followups')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaRegCalendarCheck />
            Follow Up
          </Link>

          <Link
            to="/dashboard/doctor/availability"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/availability')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaRegClock />
            Availability
          </Link>

          <Link
            to="/dashboard/doctor/completed-appointments"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/completed-appointments')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaCalendarCheck />
            Completed Appointments
          </Link>

          <Link
            to="/dashboard/doctor/patient-history"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/patient-history')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUserInjured />
            Patient History
          </Link>

          <Link
            to="/dashboard/doctor/reviews"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/reviews')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaStar />
            Reviews
          </Link>

          <Link
            to="/dashboard/doctor/earnings"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/earnings')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaMoneyBillWave />
            Earnings
          </Link>
        </div>

        <div className="border-t py-3">
          <Link
            to="/dashboard/doctor/profile"
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-md transition-all mr-1  duration-200 ${
              isActive('/dashboard/doctor/profile')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-gray-100 hover:pl-8'
            }`}
          >
            <FaUserCircle />
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

export default DoctorDashboardSidebar;
