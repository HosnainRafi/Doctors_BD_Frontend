import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [notifPrefs, setNotifPrefs] = useState({
    sms: true,
    whatsapp: true,
    email: true,
  });

  const token = localStorage.getItem("userToken");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data);
        setForm(data.data);
        setNotifPrefs(data.data?.notificationPrefs || notifPrefs);
      });
  }, [userId, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, notificationPrefs: notifPrefs }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.data);
      setEditMode(false);
      setMessage("Profile updated!");
    } else setMessage(data.message || "Failed to update profile.");
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setPassword("");
      setMessage("Password changed!");
    } else setMessage(data.message || "Failed to change password.");
  };

  // Notification preferences
  const handleNotifChange = (e) => {
    setNotifPrefs({ ...notifPrefs, [e.target.name]: e.target.checked });
  };

  if (!user) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Profile & Settings</h3>
      <div className="bg-gray-50 p-4 rounded">
        {!editMode ? (
          <>
            <div className="mb-2">
              <span className="font-medium">Name:</span> {user.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div className="mb-2">
              <span className="font-medium">Phone:</span> {user.phone}
            </div>
            <div className="mb-2">
              <span className="font-medium">Notifications:</span>
              <span className="ml-2 text-xs">
                {notifPrefs.sms && "SMS "}
                {notifPrefs.whatsapp && "WhatsApp "}
                {notifPrefs.email && "Email"}
              </span>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-2"
            >
              Edit Profile
            </button>
            <form
              onSubmit={handleChangePassword}
              className="flex items-center gap-2 mt-4"
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 border rounded"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Change Password
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Name"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Email"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Phone"
              required
            />
            <div className="mb-2">
              <span className="font-medium">Notifications:</span>
              <label className="ml-2 text-xs">
                <input
                  type="checkbox"
                  name="sms"
                  checked={notifPrefs.sms}
                  onChange={handleNotifChange}
                  className="mr-1"
                />
                SMS
              </label>
              <label className="ml-2 text-xs">
                <input
                  type="checkbox"
                  name="whatsapp"
                  checked={notifPrefs.whatsapp}
                  onChange={handleNotifChange}
                  className="mr-1"
                />
                WhatsApp
              </label>
              <label className="ml-2 text-xs">
                <input
                  type="checkbox"
                  name="email"
                  checked={notifPrefs.email}
                  onChange={handleNotifChange}
                  className="mr-1"
                />
                Email
              </label>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </form>
        )}
        {message && <div className="mt-2 text-sm">{message}</div>}
      </div>
    </div>
  );
};

export default UserProfile;
