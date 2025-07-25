import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderMsg, setReminderMsg] = useState("");
  const token = localStorage.getItem("userToken");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/v1/followups?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowUps(data.data || []);
        setLoading(false);
      });
  }, [userId, token]);

  // Send reminder
  const handleSendReminder = async (followUp) => {
    setReminderMsg("");
    // You can call your backend to send WhatsApp/SMS/email here
    // For demo, just show an alert
    alert(
      `Reminder sent to ${followUp.patient_id?.name} (${followUp.patient_id?.phone}) for follow-up on ${followUp.scheduled_date}.`
    );
    setReminderMsg("Reminder sent!");
    setTimeout(() => setReminderMsg(""), 2000);
  };

  // Book follow-up appointment
  const handleBookFollowUp = (followUp) => {
    // You can redirect to your appointment booking page with pre-filled info
    navigate("/book-appointment", {
      state: {
        patient_id: followUp.patient_id?._id,
        doctor_id:
          followUp.doctor_id?._id || followUp.registered_doctor_id?._id,
        date: followUp.scheduled_date,
      },
    });
  };

  if (loading) return <div>Loading follow-ups...</div>;

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
                  Patient: {f.patient_id?.name}
                </span>
                <span className="ml-2 text-gray-400 text-xs">
                  Doctor: {f.doctor_id?.name || f.registered_doctor_id?.name}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Advice:{" "}
                {f.notes || <span className="text-gray-400">No advice</span>}
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleSendReminder(f)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
              >
                Send Reminder
              </button>
              <button
                onClick={() => handleBookFollowUp(f)}
                className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
              >
                Book Follow-Up
              </button>
            </div>
          </li>
        ))}
      </ul>
      {reminderMsg && (
        <div className="mt-2 text-sm text-green-700">{reminderMsg}</div>
      )}
    </div>
  );
};

export default FollowUpList;
