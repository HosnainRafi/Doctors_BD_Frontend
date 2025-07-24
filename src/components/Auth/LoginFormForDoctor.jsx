import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DoctorLoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(
      'https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (data.success && data.data.token) {
      localStorage.setItem('doctorToken', data.data.token);
      toast.success('Login successful!');
      navigate('/doctor/dashboard');
    } else {
      const errorMsg = data.error || 'Login failed.';
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500  transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-gray-700 font-medium"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition"
      >
        Login
      </button>
    </form>
  );
};

export default DoctorLoginForm;
