import React, { useEffect, useState } from "react";

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/v1/followups/registered-doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => setFollowUps(data.data || []));
  }, [doctorId, doctorToken]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Follow-Ups</h3>
      <ul className="divide-y">
        {followUps.map((f) => (
          <li key={f._id} className="py-2">
            <span className="font-medium">{f.scheduled_date}</span>
            <span className="ml-2 text-gray-500 text-sm">{f.status}</span>
            <span className="ml-2 text-gray-400 text-xs">{f.notes}</span>
            <span className="ml-2 text-gray-400 text-xs">
              {f.patient_id?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpList;
