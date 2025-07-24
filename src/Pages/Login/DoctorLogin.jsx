import React from 'react';
import DoctorLoginForm from '../../components/Auth/LoginFormForDoctor';

const DoctorLogin = () => (
  <div
    className="flex items-center justify-center bg-gray-50 px-4 py-10"
    style={{ minHeight: 'calc(100vh - 65px)' }}
  >
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 ring-1 ring-purple-300 ring-opacity-30 hover:shadow-purple-500/40 transition-shadow duration-300">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-4 text-center tracking-wide">
        Doctor Login
      </h2>
      <hr className="border border-t-purple-700" />
      <DoctorLoginForm />
      <div className="mt-6 text-center text-sm text-black font-medium">
        Not registered?{' '}
        <a
          href="/register/doctor"
          className="text-purple-700 font-bold hover:underline hover:text-purple-900 transition-colors duration-200"
        >
          Register as Doctor
        </a>
      </div>
    </div>
  </div>
);

export default DoctorLogin;
