import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserRegisterForm from '../../../components/Auth/UserRegisterForm';
import { useEffect, useState } from 'react';

const UserRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    if (location.pathname.includes('/register/doctor')) {
      setActiveTab('doctor');
    } else {
      setActiveTab('user');
    }
  }, [location.pathname]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'user' ? '/register' : '/register/doctor');
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-50 px-4 py-10"
      style={{ minHeight: 'calc(100vh - 65px)' }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 ring-1 ring-blue-300 ring-opacity-30 hover:shadow-blue-500/40 transition-shadow duration-300">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => switchTab('user')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'user'
                ? 'border-b-2 border-blue-700 text-blue-700'
                : 'text-gray-500 hover:text-blue-700'
            }`}
          >
            User Register
          </button>
          <button
            onClick={() => switchTab('doctor')}
            className={`flex-1 py-2 text-lg font-semibold transition ${
              activeTab === 'doctor'
                ? 'border-b-2 border-blue-700 text-blue-700'
                : 'text-gray-500 hover:text-blue-700'
            }`}
          >
            Doctor Register
          </button>
        </div>

       

        {/* Form */}
        {activeTab === 'user' ? <UserRegisterForm /> : <DoctorRegisterForm />}

        {/* Bottom Link */}
        <div className="mt-6 text-center text-sm text-black font-medium">
          Already have an account?{' '}
          <a
            href={activeTab === 'user' ? '/login' : '/login/doctor'}
            className={`font-bold hover:underline transition-colors duration-200 ${
              activeTab === 'user'
                ? 'text-blue-700 hover:text-blue-900'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};


export default UserRegister;
