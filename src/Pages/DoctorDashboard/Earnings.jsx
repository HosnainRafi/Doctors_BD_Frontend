import React, { useEffect, useState } from "react";

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    count: 0,
    appointments: [],
  });
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = localStorage.getItem("doctorId"); // Use backend doctorId

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
      <h3 className="text-2xl font-bold text-purple-700 mb-4">Earnings</h3>
      <div className="bg-white p-6 rounded-xl shadow mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-3xl font-bold text-green-700">
            ৳ {earnings.total}
          </div>
          <div className="text-gray-500">
            {earnings.count} completed appointments
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            Earnings This Month
          </span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-right">Amount (৳)</th>
            </tr>
          </thead>
          <tbody>
            {earnings.appointments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No earnings yet.
                </td>
              </tr>
            )}
            {earnings.appointments.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-3 py-2">{a.date}</td>
                <td className="px-3 py-2">{a.time}</td>
                <td className="px-3 py-2">{a.patient_id?.name}</td>
                <td className="px-3 py-2 text-right text-green-700 font-semibold">
                  {a.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Earnings;
