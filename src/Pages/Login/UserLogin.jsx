import React from "react";
import UserLoginForm from "../../components/Auth/UserLoginForm";

const UserLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
        User Login
      </h2>
      <UserLoginForm />
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-purple-700 hover:underline font-semibold"
        >
          Register
        </a>
      </div>
    </div>
  </div>
);

export default UserLogin;
