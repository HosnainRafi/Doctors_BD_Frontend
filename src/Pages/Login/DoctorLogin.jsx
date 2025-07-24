import React from "react";
import DoctorLoginForm from "../../components/Auth/LoginFormForDoctor";

const DoctorLogin = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Doctor Login
      </h2>
      <DoctorLoginForm />
      <div className="mt-4 text-center text-sm">
        Not registered?{" "}
        <a
          href="/doctor/register"
          className="text-blue-700 hover:underline font-semibold"
        >
          Register as Doctor
        </a>
      </div>
    </div>
  </div>
);

export default DoctorLogin;
