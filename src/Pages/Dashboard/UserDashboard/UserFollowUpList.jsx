import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaCalendarAlt,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from './../../../api/axiosCommon';
import { getAuthToken } from '../../../utils/getAuthToken';
import toast from 'react-hot-toast';
import NoDataFound from './components/NoDataFound';
import { ImSpinner9 } from 'react-icons/im';

const UserFollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const id = await getUserIdByEmail();
        const response = await axiosCommon.get(`followups?user_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFollowUps(response.data.data || []);
      } catch (error) {
        toast.error(error.message || 'Failed to followup data');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  const handleSendReminder = followUp => {
    alert(
      `Reminder sent to ${followUp.patient_id?.name} (${followUp.patient_id?.phone}) for follow-up on ${followUp.scheduled_date}.`
    );
    toast.success('Reminder sent!');
  };

  const handleBookFollowUp = followUp => {
    navigate('/dashboard/user/book-appointment', {
      state: {
        patient_id: followUp.patient_id?._id,
        doctor_id:
          followUp.doctor_id?._id || followUp.registered_doctor_id?._id,
        date: followUp.scheduled_date,
      },
    });
  };

  const formatDate = iso => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-8 text-purple-700 text-center">
        Follow-Up Appointments
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : followUps.length === 0 ? (
        <NoDataFound message="No follow-ups found." />
      ) : (
        <div className="grid gap-6">
          {followUps.map(f => (
            <div
              key={f._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-sm transition-shadow duration-200 p-6 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-4">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg sm:text-xl">
                  <FaCalendarAlt className="text-xl" />
                  <span>Next Visit:</span>
                  <span className="text-xl font-bold">
                    {formatDate(f.scheduled_date)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleSendReminder(f)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Send Reminder
                  </button>
                  <button
                    onClick={() => handleBookFollowUp(f)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Book Follow-Up
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 text-[15px]">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaUser className="text-green-500" /> Patient Info
                  </h4>
                  <div className="mt-2 space-y-2 text-gray-700">
                    <p className="font-medium text-base">
                      {f.patient_id?.name}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 break-all">
                      <FaPhoneAlt className="text-sm" />
                      <a
                        href={`tel:${f.patient_id?.phone}`}
                        className="hover:underline"
                      >
                        {f.patient_id?.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 break-all">
                      <MdOutlineEmail className="text-base" />
                      <a
                        href={`mailto:${f.patient_id?.email}`}
                        className="hover:underline"
                      >
                        {f.patient_id?.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 break-words">
                      <FaMapMarkerAlt className="text-sm" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          f.patient_id?.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {f.patient_id?.address}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaUserMd className="text-purple-600" /> Doctor Info
                  </h4>
                  <p className="text-base text-gray-700 mt-2">
                    {f.doctor_id?.name || f.registered_doctor_id?.name}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {f.registered_doctor_id?.specialty || '—'}
                  </p>
                </div>
              </div>

              {f.notes && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-600">
                    Advice:
                  </h5>
                  <p className="text-gray-700 text-sm mt-1">{f.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFollowUpList;
