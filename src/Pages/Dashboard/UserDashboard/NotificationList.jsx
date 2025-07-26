import React, { useEffect, useState } from 'react';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('userToken');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/notifications?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        setNotifications(data.data || []);
        setLoading(false);
      });
  }, [userId, token]);

  // Mark as read
  const handleMarkAsRead = async id => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/notifications/${id}/read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // <-- send an empty object
      }
    );
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/notifications/mark-all-read?user_id=${userId}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
        >
          Mark All as Read
        </button>
      </div>
      <ul className="divide-y">
        {notifications.length === 0 && (
          <li className="text-gray-400 py-2">No notifications.</li>
        )}
        {notifications.map(n => (
          <li
            key={n._id}
            className={`py-2 px-2 flex items-center justify-between ${
              n.isRead ? 'bg-gray-50' : 'bg-yellow-50'
            }`}
          >
            <div>
              <div className="font-medium">{n.message}</div>
              <div className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Mark as Read
                </button>
              )}
              {n.link && (
                <a
                  href={n.link}
                  className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                >
                  View
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
