import React, { useEffect, useState } from 'react';

const ReviewForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ doctor_id: '', rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('userToken');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  // Fetch completed appointments (for which review can be left)
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/appointments?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const completed = (data.data || []).filter(
          a => a.status === 'completed'
        );
        setAppointments(completed);
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

  // Submit new or edited review
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
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
          setMessage('Review updated!');
        } else {
          setMessage(data.message || 'Failed to update review.');
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
          setMessage('Review submitted!');
        } else {
          setMessage(data.message || 'Failed to submit review.');
        }
      }
    } catch (error) {
      setMessage('An error occurred, please try again.');
      console.error(error);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // Delete review
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

  // Start editing a review
  const handleEdit = review => {
    setEditingId(review._id);
    setForm({
      doctor_id: review.doctor_id?._id || review.doctor_id,
      rating: review.rating,
      comment: review.comment || '',
    });
  };

  return (
    <div className="mb-6 max-w-5xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        Reviews & Feedback
      </h3>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor
            </label>
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={e => setForm({ ...form, doctor_id: e.target.value })}
              required
              disabled={!!editingId}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Choose a doctor</option>
              {appointments.map(a => (
                <option
                  key={a._id}
                  value={a.doctor_id?._id || a.registered_doctor_id?._id}
                >
                  Dr. {a.doctor_id?.name || a.registered_doctor_id?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={e =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback
          </label>
          <textarea
            name="comment"
            rows="4"
            placeholder="Write your feedback..."
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {editingId ? 'Update Review' : 'Submit Review'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ doctor_id: '', rating: 5, comment: '' });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <div className="mt-2 text-center text-sm text-purple-600">
            {message}
          </div>
        )}
      </form>

      <ul className="divide-y mt-8">
        {reviews.length === 0 && (
          <li className="text-gray-400 py-4 text-center">No reviews yet.</li>
        )}
        {reviews.map(r => (
          <li key={r._id} className="py-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <div className="font-semibold text-gray-900">
                  Dr. {r.doctor_id?.name || r.doctor_id}
                </div>
                <div className="text-yellow-500">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
              </div>
              <div className="text-gray-700">{r.comment}</div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewForm;
