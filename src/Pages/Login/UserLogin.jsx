import React from 'react';
import UserLoginForm from '../../components/Auth/UserLoginForm';

const UserLogin = () => (
  <div
    className="flex items-center justify-center bg-gray-100 px-4 py-10"
    style={{ minHeight: 'calc(100vh - 65px)' }}
  >
    <div className="w-full  max-w-lg bg-white rounded-2xl shadow-2xl p-10  ring-1 ring-purple-300 ring-opacity-30 hover:shadow-purple-500/40 transition-shadow duration-300">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-4 text-center tracking-wide">
        User Login
      </h2>
      <hr className='border border-t-purple-700' />
      <UserLoginForm />
      <div className="mt-6 text-center text-sm text-black font-medium">
        Don&apos;t have an account?{' '}
        <a
          href="/register"
          className="text-purple-700 font-bold hover:underline hover:text-purple-900 transition-colors duration-200"
        >
          Register
        </a>
      </div>
    </div>
  </div>
);

export default UserLogin;
