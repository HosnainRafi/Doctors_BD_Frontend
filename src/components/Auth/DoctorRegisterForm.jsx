import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from './firebase';
import { ImSpinner9 } from 'react-icons/im';

const DoctorRegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bmdc_number: '',
    specialty: '',
  });
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCredential.user, { displayName: form.name });
      const token = await userCredential.user.getIdToken();

      const res = await fetch(
        'http://localhost:5000/api/v1/registered-doctors',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            bmdc_number: form.bmdc_number,
            specialty: form.specialty,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success('Registration successful! Please complete your profile.');
        localStorage.setItem('doctorToken', token);
        localStorage.setItem('doctorId', data.data._id);
        navigate('/doctor/complete-profile');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 text-gray-700 font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-4">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 text-gray-700 font-medium">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="Enter your phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-4">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="bmdc_number"
          className="block mb-2 text-gray-700 font-medium"
        >
          BMDC Number
        </label>
        <input
          id="bmdc_number"
          name="bmdc_number"
          placeholder="Enter your BMDC number"
          value={form.bmdc_number}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="specialty"
          className="block mb-2 text-gray-700 font-medium"
        >
          Specialty
        </label>
        <input
          id="specialty"
          name="specialty"
          placeholder="Enter your specialty"
          value={form.specialty}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700
            transition placeholder-gray-400 bg-gray-50"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <ImSpinner9 className="animate-spin text-xl" />
          </div>
        ) : (
          'Register as Doctor'
        )}
      </button>
    </form>
  );
};

export default DoctorRegisterForm;
