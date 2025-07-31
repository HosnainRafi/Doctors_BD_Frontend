import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReviewCard from './components/ReviewCard';
import { getAuthToken } from '../../../utils/getAuthToken';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import DeleteConfirmModal from '../../../Modal/DeleteConfirmModal';
import { ImSpinner9 } from 'react-icons/im';
import NoDataFound from './components/NoDataFound';

const UserReviewToDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ doctor_id: '', rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const token = getAuthToken();

  // Validation error state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const id = await getUserIdByEmail();
        console.log(id);
        setUserId(id);
        const appointmentRes = await axiosCommon.get('/appointments', {
          params: { user_id: id },
        });
        setAppointments(
          (appointmentRes.data?.data || []).filter(
            a => a.status === 'completed'
          )
        );
      } catch (error) {
        toast.error(error.message || 'Error fetching appointments');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const reviewRes = await axiosCommon.get('/reviews', {
          params: { patient_id: userId },
        });
        setReviews(reviewRes.data?.data || []);
      } catch (error) {
        toast.error(error.message || 'Error fetching reviews');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, token]);

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  const openDeleteModal = id => {
    setDeletedId(id);
    setDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.doctor_id) newErrors.doctor_id = 'Doctor selection is required.';
    if (!form.rating || form.rating < 1 || form.rating > 5)
      newErrors.rating = 'Rating between 1 and 5 is required.';
    if (!form.comment.trim())
      newErrors.comment = 'Feedback comment is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (editingId) {
        const res = await axiosCommon.patch(`/reviews/${editingId}`, {
          rating: form.rating,
          comment: form.comment,
        });
        const data = res.data;
        if (data.success) {
          setReviews(reviews.map(r => (r._id === editingId ? data.data : r)));
          setEditingId(null);
          setForm({ doctor_id: '', rating: 5, comment: '' });
          toast.success('Review updated!');
          setErrors({});
        } else {
          toast.error(data.message || 'Failed to update review.');
        }
      } else {
        const res = await axiosCommon.post('/reviews', {
          doctor_id: form.doctor_id,
          patient_id: userId,
          rating: form.rating,
          comment: form.comment,
        });
        const data = res.data;
        if (data.success) {
          setReviews([data.data, ...reviews]);
          setForm({ doctor_id: '', rating: 5, comment: '' });
          toast.success('Review submitted!');
          setErrors({});
        } else {
          toast.error(data.message || 'Failed to submit review.');
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred, please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosCommon.delete(`/reviews/${deletedId}`);
      setReviews(reviews.filter(r => r._id !== deletedId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleEdit = review => {
    setEditingId(review._id);
    setForm({
      doctor_id: review.doctor_id?._id || review.doctor_id,
      rating: review.rating,
      comment: review.comment || '',
    });
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-semibold mb-10 text-center text-gray-900">
        Reviews & Feedback
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-4xl mx-auto mb-12"
        noValidate
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="doctor_id"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              id="doctor_id"
              name="doctor_id"
              value={form.doctor_id}
              onChange={e => setForm({ ...form, doctor_id: e.target.value })}
              disabled={!!editingId}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.doctor_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="" disabled>
                Choose a doctor
              </option>
              {appointments.map(a => (
                <option
                  key={a._id}
                  value={a.doctor_id?._id || a.registered_doctor_id?._id}
                >
                  Dr. {a.doctor_id?.name || a.registered_doctor_id?.name}
                </option>
              ))}
            </select>
            {errors.doctor_id && (
              <p className="text-red-600 text-xs mt-1">{errors.doctor_id}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Rating <span className="text-red-500">*</span>
            </label>
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={e =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.rating ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            {errors.rating && (
              <p className="text-red-600 text-xs mt-1">{errors.rating}</p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="comment"
            className="block mb-1 font-medium text-gray-700 text-sm"
          >
            Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="3"
            placeholder="Write your feedback..."
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            className={`w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.comment && (
            <p className="text-red-600 text-xs mt-1">{errors.comment}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {editingId ? 'Update Review' : 'Submit Review'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ doctor_id: '', rating: 5, comment: '' });
                setErrors({});
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-md transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ImSpinner9 size={40} className="animate-spin text-purple-600" />
          </div>
        ) : reviews.length === 0 ? (
          <NoDataFound message="   No reviews yet." />
        ) : (
          reviews.map(r => (
            <ReviewCard
              key={r._id}
              review={r}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
            />
          ))
        )}
      </section>
      <DeleteConfirmModal
        title="Confirm Delete"
        subTitle="Are you sure you want to delete the review? This action cannot be undone."
        buttonActionType="Delete Appointment"
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserReviewToDoctor;
