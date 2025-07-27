import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar, FaRegStar, FaEdit, FaTrashAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <FaStar key={i} className="text-yellow-400 text-lg" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400 text-lg" />
      )
    );
  }
  return <div className="flex space-x-1">{stars}</div>;
};

const ReviewCard = ({ review, onEdit, onDelete }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-1">
          Dr. {review.doctor_id?.name}
        </h4>
        <p className="text-gray-700 flex-1 text-sm">
          {review.comment || (
            <em className="italic text-gray-400">No comment provided</em>
          )}
        </p>
        <StarRating rating={review.rating} />
      </div>

      <div className="flex gap-3 mt-3 md:mt-0">
        <button
          onClick={() => onEdit(review)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Edit Review"
          title="Edit Review"
        >
          <FaEdit className="text-sm" /> Edit
        </button>
        <button
          onClick={() => onDelete(review._id)}
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          aria-label="Delete Review"
          title="Delete Review"
        >
          <FaTrashAlt className="text-sm" /> Delete
        </button>
      </div>
    </div>
  </div>
);

const ReviewForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ doctor_id: '', rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('userToken');
  const email = token ? JSON.parse(atob(token.split('.')[1])).email : null;

  // Validation error state
  const [errors, setErrors] = useState({});

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
    (async () => {
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/appointments?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setAppointments(
          (data.data || []).filter(a => a.status === 'completed')
        );
      } catch (error) {
        console.error('Error fetching appointments', error);
      }
    })();

    (async () => {
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/reviews?patient_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setReviews(data.data || []);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    })();
  }, [userId, token]);

  // Validate form fields — returns true if valid, else false
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
    if (!validateForm()) return; // prevent submit if invalid

    try {
      if (editingId) {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/reviews/${editingId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              rating: form.rating,
              comment: form.comment,
            }),
          }
        );
        const data = await res.json();
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
        const res = await fetch(
          'https://doctors-bd-backend.vercel.app/api/v1/reviews',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              doctor_id: form.doctor_id,
              patient_id: userId,
              rating: form.rating,
              comment: form.comment,
            }),
          }
        );
        const data = await res.json();
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
      toast.error('An error occurred, please try again.');
      console.error(error);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/reviews/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(reviews.filter(r => r._id !== id));
    } catch (error) {
      console.error('Failed to delete review', error);
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

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
    );
  }

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
        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10 italic">
            No reviews yet.
          </p>
        ) : (
          reviews.map(r => (
            <ReviewCard
              key={r._id}
              review={r}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default ReviewForm;
