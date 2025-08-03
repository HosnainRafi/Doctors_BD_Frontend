import React, { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaPaperPlane } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getAuthDoctorToken } from '../../../utils/getAuthDoctorToken';
import { getDoctorIdByEmail } from '../../../utils/getDoctorIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import { ImSpinner9 } from 'react-icons/im';
import DeleteConfirmModal from '../../../Modal/DeleteConfirmModal';
import WriteNoteModal from '../../../Modal/WriteNoteModal'; // ⬅️ new

const DoctorFollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const doctorToken = getAuthDoctorToken();

  useEffect(() => {
    const fetchFollowUps = async () => {
      setLoading(true);
      try {
        const id = await getDoctorIdByEmail();
        const response = await axiosCommon.get(
          `/followups/registered-doctor/${id}`,
          {
            headers: { Authorization: `Bearer ${doctorToken}` },
          }
        );
        setFollowUps(response.data.data || []);
      } catch {
        toast.error('Failed to fetch follow-ups.');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, [doctorToken]);

  const handleComplete = async id => {
    try {
      await axiosCommon.patch(
        `/followups/${id}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );
      setFollowUps(prev =>
        prev.map(f => (f._id === id ? { ...f, status: 'completed' } : f))
      );
    } catch {
      toast.error('Failed to mark as completed.');
    }
  };

  const handleSaveAdvice = async id => {
    try {
      await axiosCommon.patch(
        `/followups/${id}`,
        { notes: advice },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );
      setFollowUps(prev =>
        prev.map(f => (f._id === id ? { ...f, notes: advice } : f))
      );
      setAdvice('');
    } catch {
      toast.error('Failed to update advice.');
    }
  };

  const openReminderModal = () => {
    setShowReminderModal(true);
  };

  const statusBadge = status => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    if (status === 'completed') return `${base} bg-green-100 text-green-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  const formatDate = dateString => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return dateString;
    }
  };
  const handleReminderModalSubmit = () => {
    toast.success('This functionality will added soon', selectedFollowUpId);
    setShowReminderModal(false);
  };
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 rounded-lg md:rounded-xl bg-white ">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Patient Follow-Ups
      </h2>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ImSpinner9 size={40} className="animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {followUps.map(f => (
              <div
                key={f._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-semibold text-gray-800">
                      {f.patient_id?.name || 'Unnamed Patient'}
                    </span>
                    <span className={statusBadge(f.status)}>{f.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Date: <strong>{formatDate(f.scheduled_date)}</strong>
                  </p>

                  <div className="mt-3">
                    <p className="text-sm text-gray-700 mt-1">
                      {f.notes ? (
                        f.notes
                      ) : (
                        <span className="italic text-gray-400">No advice</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 mt-3">
                  {f.status !== 'completed' && (
                    <button
                      onClick={() => {
                        setSelectedFollowUpId(f._id);
                        setShowCompleteModal(true);
                      }}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                    >
                      <FaCheck /> Complete
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setAdvice(f.notes || '');
                      setSelectedFollowUpId(f._id);
                      setShowNoteModal(true);
                    }}
                    className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-md transition"
                  >
                    <FaEdit /> {f.notes ? 'Edit' : 'Add'} Advice
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFollowUpId(f._id);
                      openReminderModal();
                    }}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition"
                  >
                    <FaPaperPlane /> Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DeleteConfirmModal for complete */}
      <DeleteConfirmModal
        title="Complete Follow-Up"
        subTitle="Are you sure you want to mark this follow-up as completed?"
        buttonActionType="Confirm"
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={() => handleComplete(selectedFollowUpId)}
      />
      {/* DeleteConfirmModal for sending Reminder */}
      <DeleteConfirmModal
        title="Send Reminder"
        subTitle="Are you sure you want to send a reminder to this patient?"
        buttonActionType="Send"
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onConfirm={handleReminderModalSubmit}
      />
      {/* WriteNoteModal for advice */}
      <WriteNoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setAdvice('');
        }}
        onSave={() => {
          handleSaveAdvice(selectedFollowUpId);
          setShowNoteModal(false);
        }}
        advice={advice}
        setAdvice={setAdvice}
      />
    </div>
  );
};

export default DoctorFollowUpList;
