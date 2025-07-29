import React, { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiX, FiUser, FiClipboard } from 'react-icons/fi';

const DoctorCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorToken = localStorage.getItem('doctorToken');
  let doctorEmail = null;

  try {
    doctorEmail = doctorToken
      ? JSON.parse(atob(doctorToken.split('.')[1])).email
      : null;
  } catch (err) {
    doctorEmail = null;
    console.log(err);
  }

  useEffect(() => {
    const fetchDoctorId = async () => {
      if (!doctorEmail) {
        setError('Doctor email not found in token.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${doctorEmail}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = await response.json();
        if (data?.data?._id) {
          setDoctorId(data.data._id);
        } else {
          setError('Doctor not found.');
        }
      } catch {
        setError('Failed to fetch doctor info.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorId();
  }, [doctorEmail, doctorToken]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/appointments/registered-doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = await response.json();
        const completed = (data.data || []).filter(
          a => a.status === 'completed'
        );
        setAppointments(completed);
        setFiltered(completed);
      } catch {
        setError('Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, doctorToken]);

  useEffect(() => {
    let result = appointments;
    if (search) {
      result = result.filter(a =>
        a.patient_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      result = result.filter(a => a.date === date);
    }
    setFiltered(result);
  }, [search, date, appointments]);

  const handleSendReminder = patient => {
    alert(`Reminder sent to ${patient?.name} (${patient?.phone})`);
  };

  const handleScheduleFollowUp = appointment => {
    alert(`Schedule follow-up for ${appointment.patient_id?.name}`);
  };

  const handleAddNote = appointment => {
    const note = prompt(
      'Enter note for this appointment:',
      appointment.note || ''
    );
    if (note !== null) {
      setAppointments(prev =>
        prev.map(a => (a._id === appointment._id ? { ...a, note } : a))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-purple-700 font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold text-lg py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h3 className="text-3xl font-extrabold text-center text-purple-700 mb-8 border-b pb-4">
        Completed Appointments
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 transition shadow-sm"
          />
        </div>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 transition shadow-sm"
          />
        </div>
        <button
          onClick={() => {
            setSearch('');
            setDate('');
          }}
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-xl hover:bg-purple-800 transition"
        >
          Clear Filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No completed appointments found.
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map(a => (
            <div
              key={a._id}
              className="bg-white border border-gray-100 rounded-2xl shadow hover:shadow-lg transition p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {a.patient_id?.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {a.date} at {a.time}
                  </p>
                  <p className="text-xs font-semibold text-purple-600 uppercase mt-1">
                    Status: {a.status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    onClick={() => setSelected(a)}
                    className="px-3 py-1.5 text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
                  >
                    View
                  </button>
                  {a.prescription_id ? (
                    <a
                      href={`https://doctors-bd-backend.vercel.app/api/v1/prescriptions/${a.prescription_id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Download Rx
                    </a>
                  ) : (
                    <button
                      onClick={() => alert('Open prescription form')}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Write Rx
                    </button>
                  )}
                  <button
                    onClick={() => handleScheduleFollowUp(a)}
                    className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Follow-Up
                  </button>
                  <button
                    onClick={() => handleSendReminder(a.patient_id)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Reminder
                  </button>
                  <button
                    onClick={() => handleAddNote(a)}
                    className="px-3 py-1.5 text-sm border border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition"
                  >
                    {a.note ? 'Edit Note' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn transition-all duration-300">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-6 text-gray-500 hover:text-red-600 transition text-2xl"
              aria-label="Close"
            >
              <FiX />
            </button>

            <div className="mb-6 text-center border-b pb-4">
              <h4 className="text-2xl font-bold text-purple-700">
                Appointment Summary
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Detailed information about the selected appointment
              </p>
            </div>

            <div className="space-y-4 text-sm md:text-base text-gray-700">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-semibold text-gray-600">
                  <FiUser /> Patient Name:
                </span>
                <span>{selected.patient_id?.name || '-'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-semibold text-gray-600">
                  <FiCalendar /> Appointment Date:
                </span>
                <span>
                  {selected.date || '-'} at {selected.time || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-semibold text-gray-600">
                  <FiClipboard /> Status:
                </span>
                <span className="text-purple-700 font-medium capitalize">
                  {selected.status}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-2 font-semibold text-gray-600 mb-1">
                  <FiClipboard /> Notes:
                </span>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700">
                  {selected.note ? (
                    selected.note
                  ) : (
                    <span className="italic text-gray-400">
                      No notes provided.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="bg-purple-700 text-white px-5 py-2 rounded-lg hover:bg-purple-800 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCompletedAppointments;
