import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaCalendarAlt,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderMsg, setReminderMsg] = useState('');
  const [userId, setUserId] = useState('');

  const token = localStorage.getItem('userToken');
  const email = token ? JSON.parse(atob(token.split('.')[1])).email : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/users?email=${encodeURIComponent(
            email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data?.data?._id) {
          setUserId(data.data._id);
        } else {
          toast.error('User not found for this email.');
        }
      } catch (err) {
        toast.error('Error fetching user info.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, [email, token]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/followups?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        setFollowUps(data.data || []);
        setLoading(false);
      });
  }, [userId, token]);

  const handleSendReminder = followUp => {
    alert(
      `Reminder sent to ${followUp.patient_id?.name} (${followUp.patient_id?.phone}) for follow-up on ${followUp.scheduled_date}.`
    );
    setReminderMsg('Reminder sent!');
    setTimeout(() => setReminderMsg(''), 2000);
  };

  const handleBookFollowUp = followUp => {
    navigate('/book-appointment', {
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

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">
        Loading follow-ups...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center sm:text-left">
        Follow-Up Appointments
      </h2>

      {followUps.length === 0 ? (
        <div className="text-center text-gray-500">No follow-ups found.</div>
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

      {reminderMsg && (
        <div className="mt-6 text-center text-green-600 font-medium">
          {reminderMsg}
        </div>
      )}
    </div>
  );
};

export default FollowUpList;
