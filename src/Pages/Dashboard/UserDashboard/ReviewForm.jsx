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
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/appointments?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        // Only allow review for completed appointments
        const completed = (data.data || []).filter(
          a => a.status === 'completed'
        );
        setAppointments(completed);
      });
    // Fetch user's reviews
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/reviews?patient_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(res => res.json())
      .then(data => setReviews(data.data || []));
  }, [userId, token]);

  // Submit new or edited review
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (editingId) {
      // Edit review
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/reviews/${editingId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: form.rating, comment: form.comment }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map(r => (r._id === editingId ? data.data : r)));
        setEditingId(null);
        setForm({ doctor_id: '', rating: 5, comment: '' });
        setMessage('Review updated!');
      } else setMessage(data.message || 'Failed to update review.');
    } else {
      // New review
      const res = await fetch('/api/v1/reviews', {
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
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setForm({ doctor_id: '', rating: 5, comment: '' });
        setMessage('Review submitted!');
      } else setMessage(data.message || 'Failed to submit review.');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  // Delete review
  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return;
    await fetch(`https://doctors-bd-backend.vercel.app/api/v1/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(reviews.filter(r => r._id !== id));
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
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Reviews & Feedback</h3>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={e => setForm({ ...form, doctor_id: e.target.value })}
            required
            className="input"
            disabled={!!editingId}
          >
            <option value="">Select Doctor</option>
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
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            name="rating"
            value={form.rating}
            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
            className="input"
          >
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>
                {r} Star{r > 1 && 's'}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="comment"
          placeholder="Write your feedback..."
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
          className="input w-full mb-2"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
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
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
      <ul className="divide-y">
        {reviews.length === 0 && (
          <li className="text-gray-400 py-2">No reviews yet.</li>
        )}
        {reviews.map(r => (
          <li key={r._id} className="py-2">
            <div className="font-medium">
              Dr. {r.doctor_id?.name || r.doctor_id}
            </div>
            <div className="text-yellow-500">
              {'★'.repeat(r.rating)}
              {'☆'.repeat(5 - r.rating)}
            </div>
            <div className="text-gray-700">{r.comment}</div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleEdit(r)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewForm;
