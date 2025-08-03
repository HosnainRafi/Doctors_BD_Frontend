import React, { useEffect, useState } from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import { getAuthDoctorToken } from '../../../utils/getAuthDoctorToken';
import { getDoctorIdByEmail } from '../../../utils/getDoctorIdByEmail';
import AppointmentDetailsModal from '../../../Modal/AppointmentDetailsModal';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosCommon from '../../../api/axiosCommon';

const DoctorCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorToken = getAuthDoctorToken();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const id = await getDoctorIdByEmail();
        const response = await axiosCommon.get(
          `/appointments/registered-doctor/${id}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        const data = response.data;
        const completed = (data.data || []).filter(
          a => a.status === 'completed'
        );
        setAppointments(completed);
        setFiltered(completed);
      } catch {
        toast.error('Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorToken]);

  useEffect(() => {
    let result = appointments;
    if (search) {
      result = result.filter(a =>
        a.patient_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      const formatted = date.toISOString().split('T')[0];
      result = result.filter(a => a.date === formatted);
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
          <FiCalendar className="absolute left-3 top-3 text-gray-400 text-lg z-10" />
          <DatePicker
            selected={date}
            onChange={date => setDate(date)}
            placeholderText="Filter by date"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 transition shadow-sm"
            dateFormat="dd-MM-yyyy"
          />
        </div>
        <button
          onClick={() => {
            setSearch('');
            setDate(null);
          }}
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-xl hover:bg-purple-800 transition"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : filtered.length === 0 ? (
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

      <AppointmentDetailsModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        appointment={selected}
      />
    </div>
  );
};

export default DoctorCompletedAppointments;
