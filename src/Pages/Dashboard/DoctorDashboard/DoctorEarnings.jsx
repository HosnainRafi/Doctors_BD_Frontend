import React, { useEffect, useState } from 'react';

const DoctorEarnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    count: 0,
    appointments: [],
  });

  const doctorToken = localStorage.getItem('doctorToken');
  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    if (!doctorId) return;
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/earnings/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data =>
        setEarnings(data.data || { total: 0, count: 0, appointments: [] })
      );
  }, [doctorId, doctorToken]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">
        Earnings Dashboard
      </h2>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-green-50 p-6 rounded-2xl shadow-md mb-8 border border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all duration-300">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
          <h3 className="text-5xl font-extrabold text-green-700">
            ৳ {earnings.total}
          </h3>
          <p className="text-gray-500 mt-1">
            {earnings.count} Completed Appointments
          </p>
        </div>
        <div>
          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-medium shadow-sm">
            This Month's Earnings
          </span>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-purple-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Time</th>
                <th className="px-6 py-4 text-left">Patient</th>
                <th className="px-6 py-4 text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody>
              {earnings.appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    No earnings yet.
                  </td>
                </tr>
              ) : (
                earnings.appointments.map(a => (
                  <tr
                    key={a._id}
                    className="border-t hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">{a.date}</td>
                    <td className="px-6 py-4">{a.time}</td>
                    <td className="px-6 py-4">{a.patient_id?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-right text-green-700 font-semibold">
                      {a.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorEarnings;
