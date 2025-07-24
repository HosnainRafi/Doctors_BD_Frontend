import React, { useEffect, useState } from "react";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("userToken");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/v1/prescriptions?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPrescriptions(data.data || []));
  }, [userId, token]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
      <ul className="divide-y">
        {prescriptions.length === 0 && (
          <li className="text-gray-400 py-2">No prescriptions found.</li>
        )}
        {prescriptions.map((p) => (
          <li
            key={p._id}
            className="py-2 flex flex-col md:flex-row md:items-center md:gap-4"
          >
            <div className="flex-1">
              <div>
                <span className="font-medium">{p.date}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  {p.doctor_id?.name || p.registered_doctor_id?.name}
                </span>
                <span className="ml-2 text-gray-400 text-xs">
                  Patient: {p.patient_id?.name}
                </span>
                <span className="ml-2 text-gray-400 text-xs">
                  Appointment: {p.appointment_id?.date} {p.appointment_id?.time}
                </span>
              </div>
              <button
                onClick={() => setSelected(p)}
                className="mt-1 text-xs text-blue-700 underline"
              >
                View Details
              </button>
              <a
                href={`http://localhost:5000/api/v1/prescriptions/${p._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-purple-700 underline text-xs"
              >
                Download PDF
              </a>
            </div>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-2">Prescription Details</h4>
            <div className="mb-2">
              <span className="font-medium">Doctor:</span>{" "}
              {selected.doctor_id?.name || selected.registered_doctor_id?.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Patient:</span>{" "}
              {selected.patient_id?.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Date:</span> {selected.date}
            </div>
            <div className="mb-2">
              <span className="font-medium">Medicines:</span>
              <ul className="list-disc ml-6">
                {selected.medicines.map((med, i) => (
                  <li key={i}>
                    <span className="font-semibold">{med.name}</span> (
                    {med.dose}){" "}
                    {med.instructions && <span>- {med.instructions}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-medium">Advice:</span>{" "}
              {selected.advice || <span className="text-gray-400">None</span>}
            </div>
            <div className="mb-2">
              <span className="font-medium">Follow-up Date:</span>{" "}
              {selected.follow_up_date || (
                <span className="text-gray-400">None</span>
              )}
            </div>
            <div className="mt-2">
              <a
                href={`http://localhost:5000/api/v1/prescriptions/${selected._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 underline"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
