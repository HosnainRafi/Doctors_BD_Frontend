import { useEffect, useState } from 'react';
import {
  HiBell,
  HiOutlineUserCircle,
  HiRefresh,
  HiVideoCamera,
  HiX,
} from 'react-icons/hi';
import { ImSpinner10, ImSpinner9 } from 'react-icons/im';
import toast from 'react-hot-toast';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import { format, parseISO, setHours, setMinutes } from 'date-fns';
import { getAuthToken } from '../../../utils/getAuthToken';
import DeleteConfirmModal from '../../../Modal/DeleteConfirmModal';
import DoctorDetailsModal from '../../../Modal/DoctorDetailsModal';
import RescheduleAppointmentModal from '../../../Modal/RescheduleAppointmentModal';

const UserAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const token = getAuthToken();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const id = await getUserIdByEmail();
        setUserId(id);
        const response = await axiosCommon.get('/appointments', {
          params: { user_id: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data.data || []);
      } catch (error) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token, refetch]);

  const openDeleteModal = id => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteId(null);
    setDeleteModalOpen(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await axiosCommon.patch(
        `/appointments/${deleteId}`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefetch(!refetch);
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment', error);
    }
  };

  const handleReschedule = (id, currentDate, currentTime) => {
    setRescheduleId(id);
    setNewDate(currentDate);
    setNewTime(currentTime);
  };

  const handleSubmitReschedule = async () => {
    try {
      setLoading(true);
      await axiosCommon.patch(
        `/appointments/${rescheduleId}`,
        {
          date: newDate,
          time: newTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefetch(!refetch);

      setRescheduleId(null);
      setNewDate('');
      setNewTime('');
      toast.success('Appointment rescheduled successfully');
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to reschedule appointment');
      setLoading(false);
    }
  };

  const handleStartVideoCall = appointment => {
    window.open(`https://meet.jit.si/doctorbd-${appointment._id}`, '_blank');
  };

  const handleSendReminder = async appointment => {
    try {
      setLoading(true);
      const res = await axiosCommon.post(
        `/appointments/${appointment._id}/reminder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (data.success) {
        toast.success('Reminder sent successfully');
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(data.message || 'Failed to send reminder.');
      }
    } catch (error) {
      toast.error(error.message || 'Error sending reminder');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateStr => {
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr, timeStr) => {
    try {
      const [h, m] = timeStr.split(':').map(Number);
      const base = parseISO(dateStr);
      const dateWithTime = setMinutes(setHours(base, h), m);
      return format(dateWithTime, 'h:mm a');
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          My Appointments
        </h3>
        <a
          href={`/dashboard/user/book-appointment?userId=${userId}`}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Book New Appointment
        </a>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner10 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.length === 0 && (
            <div className="text-gray-400">No appointments found.</div>
          )}

          {appointments.map(a => (
            <div
              key={a._id}
              className="bg-white border border-purple-500 rounded-lg shadow-sm p-6 md:p-8 transition hover:shadow-md "
            >
              <h2 className="text-3xl font-bold text-purple-700 pb-3 text-center">
                Appointment Details
              </h2>
              <hr className="border-t border-t-purple-700" />

              <div className="flex flex-col gap-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* doctors details */}
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                        {a.registered_doctor_id?.name?.charAt(0) || 'D'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm text-purple-700 font-semibold uppercase tracking-wide">
                          Doctor Info
                        </h3>
                        <h2 className="font-semibold text-lg md:text-xl text-gray-800 flex items-center gap-2">
                          {a.doctor_id?.name ||
                            a.registered_doctor_id?.name ||
                            'Unassigned'}
                          {a.registered_doctor_id?.isOnline ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Online
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                              Offline
                            </span>
                          )}
                        </h2>
                        <div>
                          {(a.registered_doctor_id?.specialty ||
                            a.registered_doctor_id?.degree_names?.length >
                              0) && (
                            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                              {a.registered_doctor_id?.specialty && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Specialty:
                                  </span>{' '}
                                  {a.registered_doctor_id.specialty}
                                </div>
                              )}
                              {a.registered_doctor_id?.degree_names?.length >
                                0 && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Degrees:
                                  </span>{' '}
                                  {a.registered_doctor_id.degree_names.join(
                                    ', '
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end mt-1">
                          {a.status !== 'cancelled' &&
                            a.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  setDoctorDetails(a.registered_doctor_id);
                                  setShowDoctorModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-purple-700 transition duration-200"
                              >
                                <HiOutlineUserCircle className="w-4 h-4" />
                                Doctor Details
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* patient details */}
                  <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full truncate bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                        {a.patient_id?.name?.charAt(0) || 'P'}
                      </div>
                      <div className="w-full">
                        <h3 className="text-sm text-purple-700 font-semibold uppercase tracking-wide">
                          Patient Info
                        </h3>
                        <h2 className="font-semibold text-lg md:text-xl text-gray-800">
                          {a.patient_id?.name || 'Unknown'}
                        </h2>
                        <div className="text-sm text-gray-700 mt-2 space-y-1">
                          <p className="font-medium text-gray-800 flex items-center text-sm">
                            <span className="pr-3 border-r-2 border-gray-400">
                              Gender: {a.patient_id?.gender || 'N/A'}
                            </span>
                            <span className="pl-3">
                              Weight:{' '}
                              {a.patient_id?.weight
                                ? `${a.patient_id.weight} kg`
                                : 'N/A'}
                            </span>
                          </p>
                          {a.patient_id?.address && (
                            <div>
                              <span className="font-medium text-gray-800">
                                Address:
                              </span>{' '}
                              {a.patient_id.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* appointment details */}
                <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                  <h3 className="text-base font-semibold text-purple-700 mb-4">
                    Appointment Details
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center text-gray-800 font-semibold text-base space-x-2">
                      <span className="text-purple-800">
                        {formatDate(a.date)}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span>{formatTime(a.date, a.time)}</span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white uppercase ${
                        a.status === 'confirmed'
                          ? 'bg-green-500'
                          : a.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {a.reason && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-800">Reason:</span>{' '}
                      {a.reason}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-end gap-2 mt-4">
                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => openDeleteModal(a._id)}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-red-700 transition"
                        >
                          <HiX className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleReschedule(a._id, a.date, a.time)
                          }
                          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-yellow-600 transition"
                        >
                          <HiRefresh className="w-4 h-4" />
                          Reschedule
                        </button>
                      </>
                    )}

                    {a.registered_doctor_id?.isOnline &&
                      a.status === 'confirmed' && (
                        <button
                          onClick={() => handleStartVideoCall(a)}
                          className="inline-flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-purple-800 transition"
                        >
                          <HiVideoCamera className="w-4 h-4" />
                          Join Video Call
                        </button>
                      )}

                    <button
                      onClick={() => handleSendReminder(a)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:bg-blue-700 transition"
                    >
                      <HiBell className="w-4 h-4" />
                      {loading ? <ImSpinner9 className='animate-spin' /> : 'Send Reminder'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        title="Confirm Cancel"
        subTitle="Are you sure you want to cancel appointment? This action cannot be undone."
        buttonActionType="Cancel Appointment"
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      {showDoctorModal && (
        <DoctorDetailsModal
          doctorDetails={doctorDetails}
          isOpen={showDoctorModal}
          onClose={() => setShowDoctorModal(false)}
        />
      )}
      {rescheduleId && (
        <RescheduleAppointmentModal
          isOpen={true}
          loading={loading}
          onClose={() => setRescheduleId(null)}
          onSubmit={handleSubmitReschedule}
          newDate={newDate}
          setNewDate={setNewDate}
          newTime={newTime}
          setNewTime={setNewTime}
        />
      )}
    </div>
  );
};

export default UserAppointmentList;
