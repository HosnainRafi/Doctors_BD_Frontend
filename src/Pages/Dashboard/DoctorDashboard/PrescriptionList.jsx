import React, { useEffect, useState } from 'react';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const doctorToken = localStorage.getItem('doctorToken');
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split('.')[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/prescriptions/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => setPrescriptions(data.data || []));
  }, [doctorId, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-purple-700 mb-4">Prescriptions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.length === 0 && (
          <div className="text-gray-400 py-2 col-span-2 text-center bg-white rounded shadow">
            No prescriptions found.
          </div>
        )}
        {prescriptions.map(p => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-lg">
                  {p.patient_id?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {p.patient_id?.phone}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span> {p.date}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Appointment:</span>{' '}
                {p.appointment_id?.date} {p.appointment_id?.time}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelected(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                View Details
              </button>
              <a
                href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${p._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-700 text-white px-3 py-1 rounded text-xs hover:bg-purple-800"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-2">Prescription Details</h4>
            <div className="mb-2">
              <span className="font-medium">Patient:</span>{' '}
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
                    {med.dose}){' '}
                    {med.instructions && <span>- {med.instructions}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-medium">Advice:</span>{' '}
              {selected.advice || <span className="text-gray-400">None</span>}
            </div>
            <div className="mb-2">
              <span className="font-medium">Follow-up Date:</span>{' '}
              {selected.follow_up_date || (
                <span className="text-gray-400">None</span>
              )}
            </div>
            <div className="mt-2">
              <a
                href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${selected._id}/pdf`}
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
