import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { getAuthDoctorToken } from '../../../utils/getAuthDoctorToken';
import { getDoctorIdByEmail } from '../../../utils/getDoctorIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import NoDataFound from '../UserDashboard/components/NoDataFound';

const DoctorReviewsToPatients = () => {
  const [reviews, setReviews] = useState([]);
  const [reply, setReply] = useState('');
  const [replyId, setReplyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorToken = getAuthDoctorToken();

  useEffect(() => {
    setLoading(true);
    const fetchReviews = async () => {
      try {
        const id = await getDoctorIdByEmail();
        const res = await axiosCommon.get(`/reviews/doctor/${id}`, {
          headers: { Authorization: `Bearer ${doctorToken}` },
        });
        setReviews(res.data.data || []);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [doctorToken]);

  const handleReply = async id => {
    try {
      await axiosCommon.patch(
        `/reviews/${id}/reply`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setReviews(reviews.map(r => (r._id === id ? { ...r, reply } : r)));
      setReply('');
      setReplyId(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h3 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Patient Reviews
      </h3>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : reviews.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="space-y-8">
          {reviews.map(r => (
            <div
              key={r._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex items-start sm:items-center gap-4 mb-4">
                <div className="bg-purple-200 text-purple-800 font-bold w-12 h-12 flex items-center justify-center rounded-full text-xl uppercase shadow">
                  {r.patient_id?.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900">
                    {r.patient_id?.name || 'Unknown'}
                  </div>
                  <div className="text-yellow-500 text-sm">
                    {'★'.repeat(r.rating)}
                    {'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-700 italic pl-4 border-l-4 border-purple-300 mb-4">
                “{r.comment}”
              </blockquote>

              {r.reply ? (
                <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md text-sm border border-green-200">
                  <strong className="font-medium">Reply:</strong> {r.reply}
                </div>
              ) : replyId === r._id ? (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    className="w-full sm:w-2/3 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                    placeholder="Write your reply..."
                  />
                  <button
                    onClick={() => handleReply(r._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    Send Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyId(r._id)}
                  className="mt-3 text-sm text-purple-600 border border-purple-100 bg-purple-50 hover:bg-purple-100 px-4 py-1.5 rounded-md transition"
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsToPatients;
