import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.data));
  }, []);

  if (!user) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Profile</h3>
      <div className="bg-gray-50 p-4 rounded">
        <div>
          <span className="font-medium">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {user.phone}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
