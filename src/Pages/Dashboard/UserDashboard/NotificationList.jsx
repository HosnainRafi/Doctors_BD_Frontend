import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBell, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const token = localStorage.getItem('userToken');
  const email = token ? JSON.parse(atob(token.split('.')[1])).email : null;

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/users?email=${encodeURIComponent(
            email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data?.data?._id) {
          setUserId(data.data._id);
        } else {
          toast.error('User not found for this email.');
        }
      } catch (err) {
        toast.error('Error fetching user info.',err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, [email, token]);

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

  const handleMarkAsRead = async id => {
    await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/notifications/${id}/read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

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

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-lg font-medium">
        Loading notifications...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <FaBell className="text-purple-600" />
          Notifications
        </h2>
        <button
          onClick={handleMarkAllAsRead}
          disabled={notifications.every(n => n.isRead)}
          className={`px-4 py-2 rounded-md text-white font-semibold text-sm transition ${
            notifications.every(n => n.isRead)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          title={
            notifications.every(n => n.isRead)
              ? 'All notifications are already read'
              : 'Mark all as read'
          }
        >
          Mark All as Read
        </button>
      </header>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-20">
          No notifications to show.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(n => (
            <li
              key={n._id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-xl border transition-shadow ${
                n.isRead
                  ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  : 'bg-purple-50 border-purple-300 shadow-lg hover:shadow-xl'
              }`}
              title={n.isRead ? 'Read notification' : 'Unread notification'}
            >
              <div className="flex-1">
                <p
                  className={`font-medium text-gray-800 ${
                    n.isRead ? '' : 'font-semibold'
                  }`}
                >
                  {n.message}
                </p>
                <time
                  dateTime={n.createdAt}
                  className="text-xs text-gray-400 mt-1 block"
                >
                  {new Date(n.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                    aria-label="Mark as read"
                  >
                    <FaCheckCircle className="inline mr-1 -mt-0.5" />
                    Mark as Read
                  </button>
                )}
                <Link
                  to={'/dashboard/user/appointment'}
                  className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition flex items-center gap-1"
                  aria-label="View notification details"
                >
                  View
                  <FaExternalLinkAlt className="text-xs" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
