import React, { useEffect, useState } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reply, setReply] = useState("");
  const [replyId, setReplyId] = useState(null);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = localStorage.getItem("doctorId"); // <-- FIXED

  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/api/v1/reviews/doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.data || []));
  }, [doctorId, doctorToken]);

  const handleReply = async (id) => {
    await fetch(`http://localhost:5000/api/v1/reviews/${id}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({ reply }),
    });
    setReviews(reviews.map((r) => (r._id === id ? { ...r, reply } : r)));
    setReply("");
    setReplyId(null);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Patient Reviews</h3>
      <ul className="divide-y">
        {reviews.length === 0 && (
          <li className="text-gray-400 py-2">No reviews found.</li>
        )}
        {reviews.map((r) => (
          <li key={r._id} className="py-2">
            <div className="font-medium">{r.patient_id?.name}</div>
            <div className="text-yellow-500">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <div className="text-gray-700">{r.comment}</div>
            {r.reply ? (
              <div className="text-green-700 mt-1">Reply: {r.reply}</div>
            ) : (
              <div className="mt-1">
                {replyId === r._id ? (
                  <>
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="border px-2 py-1 rounded w-64"
                    />
                    <button
                      onClick={() => handleReply(r._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded ml-2"
                    >
                      Send
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setReplyId(r._id)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                  >
                    Reply
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
