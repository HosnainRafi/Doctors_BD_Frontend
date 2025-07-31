import React, { useEffect, useState } from 'react';
import PrescriptionForm from './PrescriptionForm';
import { FaClipboard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAuthDoctorToken } from '../../../utils/getAuthDoctorToken';
import { getDoctorIdByEmail } from '../../../utils/getDoctorIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import AppointmentTable from './components/AppointmentTable';
import { ImSpinner9 } from 'react-icons/im';

const DoctorAppointmentList = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const doctorToken = getAuthDoctorToken();
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setPageLoading(true);
        const id = await getDoctorIdByEmail();
        const res = await axiosCommon.get(
          `/appointments/registered-doctor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${doctorToken}`,
            },
          }
        );
        setAppointments(res.data.data || []);
      } catch (err) {
        toast.error(err.message || 'Error fetching data');
      } finally {
        setPageLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorToken]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter(
    a => a.date > today && a.status !== 'cancelled'
  );
  const todayList = appointments.filter(
    a => a.date === today && a.status !== 'cancelled'
  );
  const past = appointments.filter(
    a => a.date < today || a.status === 'completed' || a.status === 'cancelled'
  );

  const handleStatusChange = async (id, status) => {
    try {
      setPageLoading(true);
      await axiosCommon.patch(
        `/appointments/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );
      setAppointments(prev =>
        prev.map(a => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setPageLoading(false);
    }
  };

  const handleStartVideoCall = appointment => {
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, '_blank');
  };

  const hasAnyAppointments =
    todayList.length > 0 || upcoming.length > 0 || past.length > 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-200">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        <FaClipboard className="text-purple-700" />
        Doctor Appointments
      </h2>

      {pageLoading && (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      )}

      {selectedAppointment && (
        <PrescriptionForm
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCreated={() => setSelectedAppointment(null)}
        />
      )}

      {!pageLoading && (
        <>
          <Section title="Today's Appointments">
            <AppointmentTable
              appointments={todayList}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
            />
          </Section>

          <Section title="Upcoming Appointments">
            <AppointmentTable
              appointments={upcoming}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
            />
          </Section>

          <Section title="Past Appointments">
            <AppointmentTable
              appointments={past}
              onStatusChange={handleStatusChange}
              onStartVideoCall={handleStartVideoCall}
              onCreatePrescription={setSelectedAppointment}
              isPast
            />
          </Section>

          {!hasAnyAppointments && (
            <div className="text-center text-gray-400 py-8 text-lg font-semibold">
              No appointments found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-purple-600 border-b pb-1 border-purple-300">
      {title}
    </h3>
    {children}
  </div>
);

export default DoctorAppointmentList;
