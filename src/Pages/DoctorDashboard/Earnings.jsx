import React, { useEffect, useState } from "react";

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    count: 0,
    appointments: [],
  });
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/api/v1/appointments/earnings/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setEarnings(data.data || { total: 0, count: 0, appointments: [] })
      );
  }, [doctorId, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Earnings</h3>
      <div className="bg-white p-4 rounded shadow mb-2">
        <div className="text-2xl font-bold text-green-700">
          ৳ {earnings.total}
        </div>
        <div className="text-gray-500">
          {earnings.count} completed appointments
        </div>
      </div>
      <ul className="divide-y">
        {earnings.appointments.map((a) => (
          <li key={a._id} className="py-2 flex justify-between">
            <span>
              {a.date} {a.time} - {a.patient_id?.name}
            </span>
            <span className="text-green-700 font-semibold">৳ {a.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Earnings;
