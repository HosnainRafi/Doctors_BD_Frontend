import React, { useEffect, useState } from "react";

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [advice, setAdvice] = useState("");
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(
      `http://localhost:5000/api/v1/followups/registered-doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFollowUps(data.data || []);
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  const handleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/v1/followups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({ status: "completed" }),
    });
    setFollowUps((prev) =>
      prev.map((f) => (f._id === id ? { ...f, status: "completed" } : f))
    );
  };

  const handleEditAdvice = (id, currentAdvice) => {
    setEditId(id);
    setAdvice(currentAdvice || "");
  };

  const handleSaveAdvice = async (id) => {
    await fetch(`http://localhost:5000/api/v1/followups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doctorToken}`,
      },
      body: JSON.stringify({ notes: advice }),
    });
    setFollowUps((prev) =>
      prev.map((f) => (f._id === id ? { ...f, notes: advice } : f))
    );
    setEditId(null);
    setAdvice("");
  };

  const handleSendReminder = (patientPhone, notes) => {
    // You can call your backend to send WhatsApp/SMS/email here
    alert(`Reminder sent to ${patientPhone}!\nAdvice: ${notes}`);
  };

  //if (loading) return <div>Loading follow-ups...</div>;
  if (!loading && (!followUps || followUps.length === 0)) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Follow-Ups</h3>
        <div className="text-center text-gray-400 py-8 text-lg font-semibold">
          No follow-ups scheduled.
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Follow-Ups</h3>
      <ul className="divide-y">
        {followUps.length === 0 && (
          <li className="text-gray-400 py-2">No follow-ups scheduled.</li>
        )}
        {followUps.map((f) => (
          <li
            key={f._id}
            className="py-2 flex flex-col md:flex-row md:items-center md:gap-4"
          >
            <div className="flex-1">
              <div>
                <span className="font-medium">{f.scheduled_date}</span>
                <span className="ml-2 text-gray-500 text-sm">{f.status}</span>
                <span className="ml-2 text-gray-400 text-xs">
                  {f.patient_id?.name}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {editId === f._id ? (
                  <input
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="border px-2 py-1 rounded w-64"
                  />
                ) : (
                  f.notes || (
                    <span className="italic text-gray-400">No advice</span>
                  )
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {f.status !== "completed" && (
                <button
                  onClick={() => handleComplete(f._id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Mark Completed
                </button>
              )}
              {editId === f._id ? (
                <button
                  onClick={() => handleSaveAdvice(f._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                >
                  Save Advice
                </button>
              ) : (
                <button
                  onClick={() => handleEditAdvice(f._id, f.notes)}
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                >
                  {f.notes ? "Edit Advice" : "Add Advice"}
                </button>
              )}
              <button
                onClick={() => handleSendReminder(f.patient_id?.phone, f.notes)}
                className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
              >
                Send Reminder
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpList;
