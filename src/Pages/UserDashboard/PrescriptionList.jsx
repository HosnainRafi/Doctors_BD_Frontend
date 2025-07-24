import React, { useEffect, useState } from "react";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    fetch(`http://localhost:5000/api/v1/prescriptions?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPrescriptions(data.data || []));
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
      <ul className="divide-y">
        {prescriptions.map((p) => (
          <li key={p._id} className="py-2">
            <span className="font-medium">{p.date}</span>
            <span className="ml-2 text-gray-500 text-sm">
              {p.doctor_id?.name || p.registered_doctor_id?.name}
            </span>
            <a
              href={`http://localhost:5000/api/v1/prescriptions/${p._id}/pdf`}
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
