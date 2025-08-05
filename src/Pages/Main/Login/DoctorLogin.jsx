import React, { useEffect, useState } from 'react';
import DoctorLoginForm from '../../../components/Auth/LoginFormForDoctor';
import { useLocation, useNavigate } from 'react-router-dom';
import UserLoginForm from '../../../components/Auth/UserLoginForm';

const DoctorLogin = () => {
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

  const switchTab = (tab) => {
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
            onClick={() => switchTab('user')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'user'
                ? 'border-b-2 border-purple-700 text-purple-700'
                : 'text-gray-500 hover:text-purple-700'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => switchTab('doctor')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'doctor'
                ? 'border-b-2 border-purple-700 text-purple-700'
                : 'text-gray-500 hover:text-purple-700'
            }`}
          >
            Doctor Login
          </button>
        </div>

        {/* Heading */}
        {/* <h2
          className={`text-3xl font-extrabold mb-4 text-center tracking-wide ${
            activeTab === 'user' ? 'text-purple-700' : 'text-blue-700'
          }`}
        >
          {activeTab === 'user' ? 'User Login' : 'Doctor Login'}
        </h2>
        <hr
          className={`border mb-6 ${
            activeTab === 'user' ? 'border-t-purple-700' : 'border-t-blue-700'
          }`}
        /> */}

        {/* Form */}
        {activeTab === 'user' ? <UserLoginForm /> : <DoctorLoginForm />}

        {/* Bottom Link */}
        <div className="mt-6 text-center text-sm text-black font-medium">
          {activeTab === 'user' ? (
            <>
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="text-purple-700 font-bold hover:underline hover:text-purple-900 transition-colors duration-200"
              >
                Register
              </a>
            </>
          ) : (
            <>
              Not registered?{' '}
              <a
                href="/register/doctor"
                className="text-blue-700 font-bold hover:underline hover:text-blue-900 transition-colors duration-200"
              >
                Register as Doctor
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
