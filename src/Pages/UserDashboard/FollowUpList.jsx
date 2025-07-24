import React, { useEffect, useState } from "react";

const FollowUpList = () => {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    fetch(`http://localhost:5000/api/v1/followups?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFollowUps(data.data || []));
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Follow-Ups</h3>
      <ul className="divide-y">
        {followUps.map((f) => (
          <li key={f._id} className="py-2">
            <span className="font-medium">{f.scheduled_date}</span>
            <span className="ml-2 text-gray-500 text-sm">{f.status}</span>
            <span className="ml-2 text-gray-400 text-xs">{f.notes}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpList;
