import React, { useEffect, useState } from 'react';
import { FaBell, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAuthToken } from '../../../utils/getAuthToken';
import { getUserIdByEmail } from '../../../utils/getUserIdByEmail';
import axiosCommon from '../../../api/axiosCommon';
import toast from 'react-hot-toast';
import NoDataFound from './components/NoDataFound';
import { ImSpinner9 } from 'react-icons/im';

const UserNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [refetch, setRefetch] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const id = await getUserIdByEmail();
        setUserId(id);
        const res = await axiosCommon.get(`/notifications?user_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data.data || []);
      } catch (error) {
        toast.error(error.message || 'Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [refetch, token]);
  const handleMarkAsRead = async id => {
    try {
      await axiosCommon.patch(`/notifications/${id}/read`, {});
      setRefetch(!refetch);
    } catch (error) {
      toast.error(error.message || 'Error marking as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosCommon.patch(`/notifications/mark-all-read`, null, {
        params: { user_id: userId },
      });
      setRefetch(!refetch);
    } catch (error) {
      toast.error(error.message || 'Error marking all as read');
    }
  };

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      ) : notifications.length === 0 ? (
        <NoDataFound message="No notifications to show." />
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

export default UserNotificationList;
