import React, { useState } from "react";

const AddPatientForm = ({ onPatientAdded }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("userToken");
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    const res = await fetch("http://localhost:5000/api/v1/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, user_id: userId }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Patient added!");
      setForm({
        name: "",
        phone: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
      });
      onPatientAdded && onPatientAdded();
    } else setMessage(data.message || "Failed to add patient.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
        />
        <input
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          className="input"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="input"
        />
      </div>
      <button
        type="submit"
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Add Patient
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default AddPatientForm;
