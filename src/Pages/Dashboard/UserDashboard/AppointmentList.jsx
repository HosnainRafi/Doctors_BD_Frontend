import React, { useEffect, useState } from 'react';

const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderMsg, setReminderMsg] = useState('');
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const token = localStorage.getItem('userToken');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        setAppointments(data.data || []);
        setLoading(false);
      });
  }, [userId, token]);

  // Cancel appointment
  const handleCancel = async id => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      }
    );
    setAppointments(prev =>
      prev.map(a => (a._id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleReschedule = (id, currentDate, currentTime) => {
    setRescheduleId(id);
    setNewDate(currentDate);
    setNewTime(currentTime);
  };

  // Start video call
  const handleStartVideoCall = appointment => {
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, '_blank');
  };

  const handleSubmitReschedule = async id => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      }
    );
    setAppointments(prev =>
      prev.map(a => (a._id === id ? { ...a, date: newDate, time: newTime } : a))
    );
    setRescheduleId(null);
    setNewDate('');
    setNewTime('');
  };

  // Send reminder
  const handleSendReminder = async appointment => {
    setReminderMsg('');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments/${appointment._id}/reminder`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) setReminderMsg('Reminder sent!');
    else setReminderMsg(data.message || 'Failed to send reminder.');
    setTimeout(() => setReminderMsg(''), 2000);
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">My Appointments</h3>
        <a
          href="/book-appointment"
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          Book New Appointment
        </a>
      </div>
      <ul className="divide-y">
        {appointments.length === 0 && (
          <li className="text-gray-400 py-2">No appointments found.</li>
        )}
        {appointments.map(a => (
          <li
            key={a._id}
            className="py-2 flex flex-col md:flex-row md:items-center md:gap-4"
          >
            <div className="flex-1">
              <div>
                <span className="font-medium">
                  {a.date} {a.time}
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>
                <span className="ml-2 text-gray-400 text-xs">
                  {a.patient_id?.name}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Doctor: {a.doctor_id?.name || a.registered_doctor_id?.name}
                {a.registered_doctor_id?.isOnline && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Online
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2 md:mt-0">
              <div className="flex gap-2">
                {a.status !== 'cancelled' && a.status !== 'completed' && (
                  <>
                    <button
                      onClick={() => handleCancel(a._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReschedule(a._id, a.date, a.time)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      Reschedule
                    </button>
                  </>
                )}
                {a.registered_doctor_id?.isOnline &&
                  a.status === 'confirmed' && (
                    <button
                      onClick={() => handleStartVideoCall(a)}
                      className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                    >
                      Join Video Call
                    </button>
                  )}
                <button
                  onClick={() =>
                    alert(
                      JSON.stringify(
                        a.doctor_id || a.registered_doctor_id,
                        null,
                        2
                      )
                    )
                  }
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                >
                  Doctor Details
                </button>
                <button
                  onClick={() => handleSendReminder(a)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Send Reminder
                </button>
              </div>
              {rescheduleId === a._id && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmitReschedule(a._id);
                  }}
                  className="flex gap-2 mt-2"
                >
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleId(null)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
      {reminderMsg && (
        <div className="mt-2 text-sm text-green-700">{reminderMsg}</div>
      )}
    </div>
  );
};

export default AppointmentList;
