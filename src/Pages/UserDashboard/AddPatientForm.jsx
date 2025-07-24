import React, { useState, useEffect } from "react";

// Helper to calculate age from dob
function calculateAge(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years}y ${months}m`;
}

const AddPatientForm = ({ onPatientAdded, userId, editPatient }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    weight: "",
    chief_complaints: "", // as a comma-separated string or textarea
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editPatient) {
      setForm({
        name: editPatient.name || "",
        phone: editPatient.phone || "",
        email: editPatient.email || "",
        dob: editPatient.dob || "",
        gender: editPatient.gender || "",
        address: editPatient.address || "",
        weight: editPatient.weight || "",
        chief_complaints: (editPatient.chief_complaints || []).join("\n"),
      });
    }
  }, [editPatient]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("userToken");
    const chiefComplaintsArray = form.chief_complaints
      ? form.chief_complaints
          .split("\n")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];
    const payload = {
      ...form,
      user_id: userId,
      chief_complaints: chiefComplaintsArray,
    };
    try {
      if (editPatient) {
        console.log("Updating patient", payload);
        const res = await fetch(
          `http://localhost:5000/api/v1/patients/${editPatient._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();
        if (data.success) {
          setMessage("Patient updated!");
          onPatientAdded && onPatientAdded();
        } else setMessage(data.message || "Failed to update patient.");
      } else {
        // ...add patient code...
      }
    } catch (err) {
      setMessage("Network or server error");
      console.error(err);
    }
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
          type="date"
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
        <input
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          className="input"
        />
        <div className="flex items-center">
          <label className="block text-gray-700 font-medium mr-2">Age:</label>
          <span className="text-gray-900">{calculateAge(form.dob)}</span>
        </div>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700 font-medium mb-1">
          Chief Complaints
        </label>
        <textarea
          name="chief_complaints"
          placeholder="Enter each complaint on a new line"
          value={form.chief_complaints}
          onChange={handleChange}
          className="input w-full"
          rows={2}
        />
      </div>
      <button
        type="submit"
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {editPatient ? "Update Patient" : "Add Patient"}
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default AddPatientForm;
