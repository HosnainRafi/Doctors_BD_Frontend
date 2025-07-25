import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "./firebase";

const DoctorRegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bmdc_number: "",
    specialty: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // 1. Register with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCredential.user, { displayName: form.name });
      const token = await userCredential.user.getIdToken();

      // 2. Create doctor in your backend (minimal info)
      const res = await fetch(
        "http://localhost:5000/api/v1/registered-doctors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        toast.success("Registration successful! Please complete your profile.");
        // Save token and doctor id for profile completion
        localStorage.setItem("doctorToken", token);
        localStorage.setItem("doctorId", data.data._id);
        navigate("/doctor/complete-profile");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage(err.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Doctor Registration</h2>
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
      />
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
        name="phone"
        placeholder="Phone"
        value={form.phone}
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
      <input
        name="bmdc_number"
        placeholder="BMDC Number"
        value={form.bmdc_number}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
      />
      <input
        name="specialty"
        placeholder="Specialty"
        value={form.specialty}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition placeholder-gray-400 bg-gray-50"
      />
      <button type="submit" className="btn-primary mt-2">
        Register
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default DoctorRegisterForm;
