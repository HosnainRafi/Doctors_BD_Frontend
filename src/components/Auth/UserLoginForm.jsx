// components/Auth/UserLoginForm.jsx
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const UserLoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:5000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success && data.data.token) {
      localStorage.setItem("userToken", data.data.token);
      setMessage("Login successful!");
      // redirect to user dashboard
      navigate("/user/dashboard"); // <-- useNavigate, not Navigate
    } else setMessage(data.message || "Login failed.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">User Login</h2>
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
      <button type="submit" className="btn-primary mt-2">
        Login
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default UserLoginForm;
