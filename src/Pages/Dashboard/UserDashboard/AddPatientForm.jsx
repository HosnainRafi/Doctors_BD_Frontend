import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

// Helper to calculate age from DOB
function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return `${age} years`;
}

const AddPatientForm = ({ onPatientAdded, userId, editPatient }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    weight: '',
    chief_complaints: '',
  });

  useEffect(() => {
    if (editPatient) {
      setForm({
        name: editPatient.name || '',
        phone: editPatient.phone || '',
        email: editPatient.email || '',
        dob: editPatient.dob || '',
        gender: editPatient.gender || '',
        address: editPatient.address || '',
        weight: editPatient.weight || '',
        chief_complaints: (editPatient.chief_complaints || []).join('\n'),
      });
    }
  }, [editPatient]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');

    const chiefComplaintsArray = form.chief_complaints
      ? form.chief_complaints
          .split('\n')
          .map(c => c.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...form,
      user_id: userId,
      chief_complaints: chiefComplaintsArray,
    };

    try {
      if (editPatient) {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/patients/${editPatient._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();
        if (data.success) {
          toast.success(
            <div className="flex items-center gap-2 text-green-600">
              <HiCheckCircle className="text-xl" />
              Patient updated successfully!
            </div>
          );
          onPatientAdded && onPatientAdded();
        } else {
          toast.error(
            <div className="flex items-center gap-2 text-red-600">
              <HiXCircle className="text-xl" />
              {data.message || 'Failed to update patient.'}
            </div>
          );
        }
      } else {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/patients`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();
        if (data.success) {
          toast.success(
            <div className="flex items-center gap-2 text-green-600">
              <HiCheckCircle className="text-xl" />
              Patient added successfully!
            </div>
          );
          setForm({
            name: '',
            phone: '',
            email: '',
            dob: '',
            gender: '',
            address: '',
            weight: '',
            chief_complaints: '',
          });
          onPatientAdded && onPatientAdded();
        } else {
          toast.error(
            <div className="flex items-center gap-2 text-red-600">
              <HiXCircle className="text-xl" />
              {data.message || 'Failed to add patient.'}
            </div>
          );
        }
      }
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2 text-red-600">
          <HiXCircle className="text-xl" />
          Something went wrong.
        </div>
      );
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 shadow rounded-md space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="Weight (kg)"
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          name="age"
          value={calculateAge(form.dob)}
          disabled
          className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-500 cursor-not-allowed"
          placeholder="Age"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Chief Complaints
        </label>
        <textarea
          name="chief_complaints"
          value={form.chief_complaints}
          onChange={handleChange}
          rows="3"
          className="border px-3 py-2 rounded w-full"
          placeholder="Each complaint in a new line"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {editPatient ? 'Update Patient' : 'Add Patient'}
      </button>
    </form>
  );
};

export default AddPatientForm;
