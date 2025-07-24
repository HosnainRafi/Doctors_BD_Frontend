import React, { useEffect, useState } from "react";

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  // Fetch all patients the doctor has seen (from appointments)
  useEffect(() => {
    if (!doctorId) return;
    fetch(
      `http://localhost:5000/api/v1/appointments/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Get unique patients from appointments
        const uniquePatients = {};
        (data.data || []).forEach((a) => {
          if (a.patient_id && a.patient_id._id) {
            uniquePatients[a.patient_id._id] = a.patient_id;
          }
        });
        setPatients(Object.values(uniquePatients));
      });
  }, [doctorId, doctorToken]);

  // Fetch history when a patient is selected
  useEffect(() => {
    if (!selectedPatient) return;
    fetch(
      `http://localhost:5000/api/v1/appointments?patient_id=${selectedPatient._id}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setAppointments(data.data || []));
    fetch(
      `http://localhost:5000/api/v1/prescriptions?patient_id=${selectedPatient._id}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setPrescriptions(data.data || []));
  }, [selectedPatient, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Patient History</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {patients.map((p) => (
          <button
            key={p._id}
            onClick={() => setSelectedPatient(p)}
            className={`px-3 py-1 rounded ${
              selectedPatient && selectedPatient._id === p._id
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      {selectedPatient && (
        <div className="bg-white rounded shadow p-4">
          <h4 className="text-md font-bold mb-2">
            {selectedPatient.name}'s Medical History
          </h4>
          <div>
            <h5 className="font-semibold mt-2 mb-1">Appointments</h5>
            <ul className="mb-2">
              {appointments.length === 0 && (
                <li className="text-gray-400">No appointments found.</li>
              )}
              {appointments.map((a) => (
                <li key={a._id} className="text-sm mb-1">
                  {a.date} {a.time} — Status: {a.status}
                </li>
              ))}
            </ul>
            <h5 className="font-semibold mt-2 mb-1">Prescriptions</h5>
            <ul>
              {prescriptions.length === 0 && (
                <li className="text-gray-400">No prescriptions found.</li>
              )}
              {prescriptions.map((p) => (
                <li key={p._id} className="text-sm mb-1">
                  {p.date} —{" "}
                  <a
                    href={`http://localhost:5000/api/v1/prescriptions/${p._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 underline"
                  >
                    Download PDF
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
