import React, { useEffect, useState } from "react";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/v1/prescriptions/registered-doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => setPrescriptions(data.data || []));
  }, [doctorId, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
      <ul className="divide-y">
        {prescriptions.map((p) => (
          <li key={p._id} className="py-2">
            <span className="font-medium">{p.date}</span>
            <span className="ml-2 text-gray-500 text-sm">
              {p.patient_id?.name}
            </span>
            <a
              href={`/api/v1/prescriptions/${p._id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-purple-700 underline"
            >
              Download PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionList;
