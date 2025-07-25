import React from "react";
import DoctorRegisterForm from "../../components/Auth/DoctorRegisterForm";

const DoctorRegister = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Doctor Registration
      </h2>
      <DoctorRegisterForm />
      <div className="mt-4 text-center text-sm">
        Already registered?{" "}
        <a
          href="/doctor/login"
          className="text-blue-700 hover:underline font-semibold"
        >
          Login as Doctor
        </a>
      </div>
    </div>
  </div>
);

export default DoctorRegister;
