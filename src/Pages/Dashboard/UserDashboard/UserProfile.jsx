import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit, FiEye, FiEyeOff, FiPhone, FiMail } from 'react-icons/fi';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('userToken');
  const email = token ? JSON.parse(atob(token.split('.')[1])).email : null;

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) return;
      setLoading(true);
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
        toast.error('User not found.');
      }
      setLoading(false);
    };
    fetchUserId();
  }, [email, token]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchUserData = async () => {
      const res = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUser(data.data);
      setForm(data.data);
      setLoading(false);
    };
    fetchUserData();
  }, [userId, token]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (data.success) {
      setUser(data.data);
      setEditMode(false);
      setMessage('Profile updated!');
    } else {
      setMessage(data.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setPassword('');
      setMessage('Password changed!');
    } else {
      setMessage(data.message || 'Failed to change password.');
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-md px-8 py-10">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://i.pravatar.cc/150"
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-purple-700 object-cover shadow"
        />
        <h2 className="mt-4 text-2xl font-semibold text-purple-700">
          User Profile
        </h2>
      </div>

      {!editMode ? (
        <div className="space-y-6 text-gray-700">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="text-lg font-medium">{user?.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <FiMail className="text-purple-700" />
            <a
              href={`mailto:${user?.email}`}
              className="hover:underline text-blue-600"
            >
              {user?.email}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <FiPhone className="text-purple-700" />
            <a
              href={`tel:${user?.phone}`}
              className="hover:underline text-blue-600"
            >
              {user?.phone}
            </a>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
            >
              Change Password
            </button>
          </form>

          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-800 mt-4"
          >
            <FiEdit /> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              placeholder="Phone"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-1/2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className="mt-6 text-center text-sm text-green-600 font-medium">
          {message}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
