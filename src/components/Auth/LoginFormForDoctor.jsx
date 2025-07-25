import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "./firebase";

const DoctorLoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("doctorToken", token);

      // Fetch doctor profile from your backend using email
      const res = await fetch(
        `http://localhost:5000/api/v1/registered-doctors?email=${form.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.data && (!data.data.bmdc_number || !data.data.specialty)) {
        // Profile incomplete, redirect to complete profile
        localStorage.setItem("doctorId", data.data._id);
        toast("Please complete your profile.");
        navigate("/doctor/complete-profile");
      } else {
        localStorage.setItem("doctorId", data.data._id);
        toast.success("Login successful!");
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      setMessage(err.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Doctor Login</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
      />
      <button
        type="submit"
        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition"
      >
        Login
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default DoctorLoginForm;
