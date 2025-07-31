import React, { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaSave, FaPaperPlane } from "react-icons/fa";
import { format } from "date-fns";

const DoctorFollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [advice, setAdvice] = useState("");
  const [doctorId, setDoctorId] = useState(null);
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
      `https://doctors-bd-backend.vercel.app/api/v1/followups/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFollowUps(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch follow-ups.");
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  const handleComplete = async (id) => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/followups/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ status: "completed" }),
      }
    );
    setFollowUps((prev) =>
      prev.map((f) => (f._id === id ? { ...f, status: "completed" } : f))
    );
  };

  const handleEditAdvice = (id, currentAdvice) => {
    setEditId(id);
    setAdvice(currentAdvice || "");
  };

  const handleSaveAdvice = async (id) => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/followups/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ notes: advice }),
      }
    );
    setFollowUps((prev) =>
      prev.map((f) => (f._id === id ? { ...f, notes: advice } : f))
    );
    setEditId(null);
    setAdvice("");
  };

  const handleSendReminder = (patientPhone, notes) => {
    alert(`Reminder sent to ${patientPhone}!\nAdvice: ${notes}`);
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "completed") return `${base} bg-green-100 text-green-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-purple-600 font-medium">
        Loading follow-ups...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500 font-medium">{error}</div>
    );
  }

  if (!loading && (!followUps || followUps.length === 0)) {
    return (
      <div className="py-10 text-center text-gray-400 font-medium">
        No follow-ups scheduled.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Patient Follow-Ups
      </h2>
      <div className="space-y-6">
        {followUps.map((f) => (
          <div
            key={f._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row md:justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-semibold text-gray-800">
                  {f.patient_id?.name || "Unnamed Patient"}
                </span>
                <span className={statusBadge(f.status)}>{f.status}</span>
              </div>
              <p className="text-sm text-gray-500">
                Date: <strong>{formatDate(f.scheduled_date)}</strong>
              </p>

              <div className="mt-3">
                {editId === f._id ? (
                  <input
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="Enter advice..."
                    className="w-full md:w-3/4 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700 mt-1">
                    {f.notes ? (
                      f.notes
                    ) : (
                      <span className="italic text-gray-400">No advice</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 items-start md:items-end">
              {f.status !== "completed" && (
                <button
                  onClick={() => handleComplete(f._id)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                >
                  <FaCheck /> Complete
                </button>
              )}

              {editId === f._id ? (
                <button
                  onClick={() => handleSaveAdvice(f._id)}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
                >
                  <FaSave /> Save
                </button>
              ) : (
                <button
                  onClick={() => handleEditAdvice(f._id, f.notes)}
                  className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-md transition"
                >
                  <FaEdit /> {f.notes ? "Edit" : "Add"} Advice
                </button>
              )}

              <button
                onClick={() => handleSendReminder(f.patient_id?.phone, f.notes)}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition"
              >
                <FaPaperPlane /> Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorFollowUpList;
