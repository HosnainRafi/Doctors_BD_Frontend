import React, { useEffect, useState } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const DoctorAppointmentList = ({ onCreatePrescription }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(
      `http://localhost:5000/api/v1/appointments/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.data || []);
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  // Helper to filter appointments
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter(
    (a) => a.date > today && a.status !== "cancelled"
  );
  const todayList = appointments.filter(
    (a) => a.date === today && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) =>
      a.date < today || a.status === "completed" || a.status === "cancelled"
  );

  // Action handlers (replace with real API calls)
  const handleStatusChange = async (id, status) => {
    await fetch(`http://localhost:5000/api/v1/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({ status }),
    });
    // Refresh list
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
  };

  const handleStartVideoCall = (appointment) => {
    // Replace with your video call logic (e.g. open Jitsi/Zoom)
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, "_blank");
  };

  //if (loading) return <div>Loading appointments...</div>;
  const hasAnyAppointments =
    todayList.length > 0 || upcoming.length > 0 || past.length > 0;
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
      <AppointmentTable
        appointments={todayList}
        onStatusChange={handleStatusChange}
        onStartVideoCall={handleStartVideoCall}
        onCreatePrescription={onCreatePrescription}
      />

      <h3 className="text-lg font-semibold mb-2 mt-6">Upcoming Appointments</h3>
      <AppointmentTable
        appointments={upcoming}
        onStatusChange={handleStatusChange}
        onStartVideoCall={handleStartVideoCall}
        onCreatePrescription={onCreatePrescription}
      />

      <h3 className="text-lg font-semibold mb-2 mt-6">Past Appointments</h3>
      <AppointmentTable
        appointments={past}
        onStatusChange={handleStatusChange}
        onStartVideoCall={handleStartVideoCall}
        onCreatePrescription={onCreatePrescription}
        isPast
      />

      {!hasAnyAppointments && (
        <div className="text-center text-gray-400 py-8 text-lg font-semibold">
          No appointments found.
        </div>
      )}
    </div>
  );
};

const AppointmentTable = ({
  appointments,
  onStatusChange,
  onStartVideoCall,
  onCreatePrescription,
  isPast,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2">Time</th>
          <th className="px-3 py-2">Patient</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-400">
              No appointments
            </td>
          </tr>
        )}
        {appointments.map((a) => (
          <tr key={a._id} className="border-t">
            <td className="px-3 py-2">{a.date}</td>
            <td className="px-3 py-2">{a.time}</td>
            <td className="px-3 py-2">
              <div className="font-medium">{a.patient_id?.name}</div>
              <div className="text-xs text-gray-500">{a.patient_id?.phone}</div>
            </td>
            <td className="px-3 py-2">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </td>
            <td className="px-3 py-2 flex flex-wrap gap-2">
              {!isPast && a.status === "pending" && (
                <>
                  <button
                    onClick={() => onStatusChange(a._id, "confirmed")}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onStatusChange(a._id, "cancelled")}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
              {!isPast && a.status === "confirmed" && (
                <>
                  <button
                    onClick={() => onStatusChange(a._id, "completed")}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => onStartVideoCall(a)}
                    className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                  >
                    Start Video Call
                  </button>
                </>
              )}
              {a.status === "completed" && onCreatePrescription && (
                <button
                  onClick={() => onCreatePrescription(a)}
                  className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700"
                >
                  Create Prescription
                </button>
              )}
              <button
                onClick={() => alert(JSON.stringify(a.patient_id, null, 2))}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
              >
                Patient Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DoctorAppointmentList;
