import React from "react";
import UserRegisterForm from "../../components/Auth/UserRegisterForm";

const UserRegister = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
        User Registration
      </h2>
      <UserRegisterForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-purple-700 hover:underline font-semibold"
        >
          Login
        </a>
      </div>
    </div>
  </div>
);

export default UserRegister;
