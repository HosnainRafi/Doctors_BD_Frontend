import React, { useEffect, useState } from "react";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/v1/appointments/registered-doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data.data || []));
  }, [doctorId, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">My Appointments</h3>
      <ul className="divide-y">
        {appointments.map((a) => (
          <li key={a._id} className="py-2">
            <span className="font-medium">
              {a.date} {a.time}
            </span>
            <span className="ml-2 text-gray-500 text-sm">{a.status}</span>
            <span className="ml-2 text-gray-400 text-xs">
              {a.patient_id?.name}
            </span>
            <span className="ml-2 text-gray-400 text-xs">{a.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
