import React, { useEffect, useState } from "react";
import AddPatientForm from "./AddPatientForm";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = JSON.parse(atob(token.split(".")[1])).id; // decode JWT to get user id
    fetch(`http://localhost:5000/api/v1/patients?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPatients(data.data || []));
  }, [showAdd]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Patients</h3>
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? "Close" : "Add Patient"}
        </button>
      </div>
      {showAdd && <AddPatientForm onPatientAdded={() => setShowAdd(false)} />}
      <ul className="divide-y">
        {patients.map((p) => (
          <li key={p._id} className="py-2">
            <span className="font-medium">{p.name}</span>
            <span className="ml-2 text-gray-500 text-sm">{p.phone}</span>
            {p.email && (
              <span className="ml-2 text-gray-400 text-xs">{p.email}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
