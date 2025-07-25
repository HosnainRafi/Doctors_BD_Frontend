import React, { useEffect, useState } from "react";
import AddPatientForm from "./AddPatientForm";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [defaultPatientId, setDefaultPatientId] = useState(
    localStorage.getItem("defaultPatientId") || ""
  );
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("userToken");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  // Fetch patients
  useEffect(() => {
    if (!userId) return;
    fetch(`https://doctors-bd-backend.vercel.app/api/v1/patients?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPatients(data.data || []));
  }, [showAdd, editPatient, userId, token]);

  // Set default patient
  const handleSetDefault = (id) => {
    setDefaultPatientId(id);
    localStorage.setItem("defaultPatientId", id);
    setMessage("Default patient set!");
    setTimeout(() => setMessage(""), 1500);
  };

  // Delete patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    await fetch(`https://doctors-bd-backend.vercel.app/api/v1/patients/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPatients((prev) => prev.filter((p) => p._id !== id));
    if (defaultPatientId === id) {
      setDefaultPatientId("");
      localStorage.removeItem("defaultPatientId");
    }
  };

  return (
    <div className="mb-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Patients</h3>
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          onClick={() => {
            setShowAdd((v) => !v);
            setEditPatient(null);
          }}
        >
          {showAdd ? "Close" : "Add Patient"}
        </button>
      </div>
      {showAdd && (
        <AddPatientForm
          onPatientAdded={() => setShowAdd(false)}
          userId={userId}
        />
      )}
      {editPatient && (
        <AddPatientForm
          editPatient={editPatient}
          onPatientAdded={() => setEditPatient(null)}
          userId={userId}
        />
      )}
      <ul className="divide-y">
        {patients.map((p) => (
          <li key={p._id} className="py-2 flex items-center justify-between">
            <div>
              <span className="font-medium">{p.name}</span>
              <span className="ml-2 text-gray-500 text-sm">{p.phone}</span>
              {p.email && (
                <span className="ml-2 text-gray-400 text-xs">{p.email}</span>
              )}
              {defaultPatientId === p._id && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSetDefault(p._id)}
                className={`px-2 py-1 rounded text-xs ${
                  defaultPatientId === p._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-green-100"
                }`}
                disabled={defaultPatientId === p._id}
              >
                Set Default
              </button>
              <button
                onClick={() => setEditPatient(p)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {message && <div className="mt-2 text-sm text-green-700">{message}</div>}
    </div>
  );
};

export default PatientList;
