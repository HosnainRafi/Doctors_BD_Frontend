import React, { useEffect, useState } from 'react';
import UserLoginForm from '../../../components/Auth/UserLoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorLoginForm from '../../../components/Auth/LoginFormForDoctor';

const UserLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    if (location.pathname.includes('/login/doctor')) {
      setActiveTab('doctor');
    } else {
      setActiveTab('user');
    }
  }, [location.pathname]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'user' ? '/login' : '/login/doctor');
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-50 px-4 py-10"
      style={{ minHeight: 'calc(100vh - 65px)' }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 ring-1 ring-purple-300 ring-opacity-30 hover:shadow-purple-500/40 transition-shadow duration-300">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => handleTabSwitch('user')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'user'
                ? 'border-b-2 border-purple-700 text-purple-700'
                : 'text-gray-500 hover:text-purple-700'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => handleTabSwitch('doctor')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'doctor'
                ? 'border-b-2 border-purple-700 text-purple-700'
                : 'text-gray-500 hover:text-purple-700'
            }`}
          >
            Doctor Login
          </button>
        </div>

        {/* Form */}
        {/* <h2
          className={`text-2xl font-bold mb-4 text-center tracking-wide ${
            activeTab === 'user' ? 'text-purple-700' : 'text-blue-700'
          }`}
        >
          {activeTab === 'user' ? 'User Login' : 'Doctor Login'}
        </h2>
        <hr
          className={`border ${
            activeTab === 'user' ? 'border-t-purple-700' : 'border-t-blue-700'
          } mb-6`}
        /> */}

        {activeTab === 'user' ? <UserLoginForm /> : <DoctorLoginForm />}

        <div className="mt-6 text-center text-sm text-black font-medium">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className={`font-bold hover:underline transition-colors duration-200 ${
              activeTab === 'user'
                ? 'text-purple-700 hover:text-purple-900'
                : 'text-blue-700 hover:text-blue-900'
            }`}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};
export default UserLogin;
