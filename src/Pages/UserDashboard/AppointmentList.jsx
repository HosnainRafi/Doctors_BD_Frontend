import React, { useEffect, useState } from "react";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    fetch(`http://localhost:5000/api/v1/appointments?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data.data || []));
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Appointments</h3>
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
            <span className="ml-2 text-gray-400 text-xs">
              {a.doctor_id?.name || a.registered_doctor_id?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
