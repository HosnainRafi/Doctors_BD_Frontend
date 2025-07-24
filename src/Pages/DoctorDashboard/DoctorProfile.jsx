import React, { useEffect, useState } from "react";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/api/v1/registered-doctors/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data.data);
        setForm(data.data);
      });
  }, [doctorId, doctorToken]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle profile photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // You can use a real file upload API here (e.g. S3, Cloudinary, or your backend)
    // For demo, we'll just use a local URL
    setForm({ ...form, photo: URL.createObjectURL(file) });
    // In production, upload the file and set the returned URL
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(
      `http://localhost:5000/api/v1/registered-doctors/${doctorId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (data.success) {
      setDoctor(data.data);
      setEditMode(false);
      setMessage("Profile updated!");
    } else setMessage(data.message || "Failed to update profile.");
  };

  // Change password
  const [password, setPassword] = useState("");
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(
      `http://localhost:5000/api/v1/registered-doctors/${doctorId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setPassword("");
      setMessage("Password changed!");
    } else setMessage(data.message || "Failed to change password.");
  };

  if (!doctor) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">My Profile</h3>
      <div className="bg-gray-50 p-4 rounded">
        {!editMode ? (
          <>
            <div className="flex items-center mb-4">
              <img
                src={
                  doctor.photo || "https://i.ibb.co/2kR5zq0/doctor-avatar.png"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 mr-4"
              />
              <button
                onClick={() => setEditMode(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Edit Profile
              </button>
            </div>
            <div>
              <span className="font-medium">Name:</span> {doctor.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {doctor.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {doctor.phone}
            </div>
            <div>
              <span className="font-medium">Specialty:</span> {doctor.specialty}
            </div>
            <div>
              <span className="font-medium">BMDC No:</span> {doctor.bmdc_number}
            </div>
            <div>
              <span className="font-medium">Bio:</span> {doctor.bio}
            </div>
            <div className="mt-4">
              <form
                onSubmit={handleChangePassword}
                className="flex items-center gap-2"
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
            </div>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="flex items-center mb-4">
              <img
                src={form.photo || "https://i.ibb.co/2kR5zq0/doctor-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 mr-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block"
              />
            </div>
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
            <input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Specialty"
            />
            <input
              name="bmdc_number"
              value={form.bmdc_number}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="BMDC Number"
            />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Bio"
            />
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

export default DoctorProfile;
