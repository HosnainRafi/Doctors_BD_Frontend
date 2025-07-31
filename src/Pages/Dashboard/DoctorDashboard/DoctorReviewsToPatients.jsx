import React, { useEffect, useState } from "react";

const DoctorReviewsToPatients = () => {
  const [reviews, setReviews] = useState([]);
  const [reply, setReply] = useState("");
  const [replyId, setReplyId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorToken = localStorage.getItem("doctorToken");
  let doctorEmail = null;
  try {
    doctorEmail = doctorToken
      ? JSON.parse(atob(doctorToken.split(".")[1])).email
      : null;
  } catch (err) {
    doctorEmail = null;
    console.log(err);
  }

  useEffect(() => {
    if (!doctorEmail) {
      setError("Doctor email not found in token.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${doctorEmail}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?._id) {
          setDoctorId(data.data._id);
        } else {
          setError("Doctor not found.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to fetch doctor info.");
        setLoading(false);
      });
  }, [doctorEmail, doctorToken]);

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/reviews/doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch reviews.");
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  const handleReply = async (id) => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/reviews/${id}/reply`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ reply }),
      }
    );
    setReviews(reviews.map((r) => (r._id === id ? { ...r, reply } : r)));
    setReply("");
    setReplyId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-3xl font-bold text-center mb-8 text-purple-700">
        Patient Reviews
      </h3>

      {loading ? (
        <div className="text-center text-gray-500 text-lg py-12">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg py-12">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-400 text-lg py-12">
          No reviews found.
        </div>
      ) : (
        <ul className="space-y-8">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-purple-100 text-purple-700 font-semibold w-12 h-12 rounded-full flex items-center justify-center text-xl">
                  {r.patient_id?.name?.[0] || "U"}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {r.patient_id?.name || "Unknown"}
                  </div>
                  <div className="text-yellow-500 text-sm mt-1">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 border-l-4 border-purple-300 pl-4 italic">
                "{r.comment}"
              </p>

              {r.reply ? (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md text-sm border border-green-200">
                  <strong>Reply:</strong> {r.reply}
                </div>
              ) : replyId === r._id ? (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="w-full sm:w-2/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                    placeholder="Write your reply..."
                  />
                  <button
                    onClick={() => handleReply(r._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    Send Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyId(r._id)}
                  className="mt-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition"
                >
                  Reply
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorReviewsToPatients;
