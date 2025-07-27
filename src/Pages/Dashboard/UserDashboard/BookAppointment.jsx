import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  // Use userId in your component
  console.log("User ID:", userId);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    registered_doctor_id: "",
    date: "",
    time: "",
    reason: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("userToken");
  //const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/patients?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setPatients(data.data || []));
    fetch(`https://doctors-bd-backend.vercel.app/api/v1/registered-doctors`)
      .then((res) => res.json())
      .then((data) => setDoctors(data.data || []));
  }, [userId, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const body = { ...form, user_id: userId };

    // Only send one doctor field
    if (body.registered_doctor_id) {
      delete body.doctor_id;
    } else if (body.doctor_id) {
      delete body.registered_doctor_id;
    }

    // Remove empty string fields
    Object.keys(body).forEach((key) => {
      if (body[key] === "") delete body[key];
    });

    const res = await fetch(
      "https://doctors-bd-backend.vercel.app/api/v1/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    if (data.success) setMessage("Appointment booked!");
    else setMessage(data.message || "Failed to book appointment.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Book Appointment
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Patient
          </label>
          <select
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Doctor
          </label>
          <select
            name="registered_doctor_id"
            value={form.registered_doctor_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Time</label>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Reason for Appointment
          </label>
          <textarea
            name="reason"
            placeholder="Describe your problem or reason for visit"
            value={form.reason}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition duration-200"
        >
          Book Appointment
        </button>
        {message && (
          <div className="mt-4 text-center text-green-700 font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;
