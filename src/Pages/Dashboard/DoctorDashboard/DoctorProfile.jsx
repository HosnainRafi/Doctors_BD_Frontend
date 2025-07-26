import React, { useState, useEffect } from 'react';

// Example specialties and degrees (you can fetch from backend if you want)
const SPECIALTIES = [
  'General Physician',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Urology',
  'Gastroenterology',
  'Oncology',
  'Other',
];
const DEGREES = [
  'MBBS',
  'FCPS',
  'MD',
  'MS',
  'MRCP',
  'FRCS',
  'BCS (Health)',
  'DGO',
  'DLO',
  'Other',
];

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const doctorToken = localStorage.getItem('doctorToken');
  const doctorId = localStorage.getItem('doctorId'); // <-- FIXED

  useEffect(() => {
    if (!doctorId) {
      setError('Doctor ID not found. Please login again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setDoctor(data.data);
          setForm({
            ...data.data,
            specialties: data.data.specialties || [],
            degree_names: data.data.degree_names || [],
          });
        } else {
          setError('Doctor not found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch doctor profile.');
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For multi-select specialties and degrees
  const handleSpecialtiesChange = e => {
    const options = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setForm({ ...form, specialties: options });
  };
  const handleDegreesChange = e => {
    const options = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setForm({ ...form, degree_names: options });
  };

  // Handle profile photo upload
  const handlePhotoChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    // For demo, use local URL. In production, upload to S3/Cloudinary/backend and set the returned URL.
    setForm({ ...form, photo: URL.createObjectURL(file) });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (data.success) {
      setDoctor(data.data);
      setEditMode(false);
      setMessage('Profile updated!');
    } else setMessage(data.message || 'Failed to update profile.');
  };

  // Change password
  const handleChangePassword = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setPassword('');
      setMessage('Password changed!');
    } else setMessage(data.message || 'Failed to change password.');
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
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
                  doctor.photo || 'https://i.ibb.co/2kR5zq0/doctor-avatar.png'
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
              <span className="font-medium">Specialty:</span>{' '}
              {doctor.specialty ||
                (doctor.specialties && doctor.specialties.join(', '))}
            </div>
            <div>
              <span className="font-medium">Degrees:</span>{' '}
              {doctor.degree_names && doctor.degree_names.join(', ')}
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="px-3 py-2 border rounded"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-xs text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
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
                src={form.photo || 'https://i.ibb.co/2kR5zq0/doctor-avatar.png'}
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
            <select
              name="specialty"
              value={form.specialty || ''}
              onChange={handleChange}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              <option value="">Select Main Specialty</option>
              {SPECIALTIES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 font-medium mb-1">
              Other Specialties (hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              name="specialties"
              value={form.specialties || []}
              onChange={handleSpecialtiesChange}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              {SPECIALTIES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 font-medium mb-1">
              Degrees (hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              name="degree_names"
              value={form.degree_names || []}
              onChange={handleDegreesChange}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              {DEGREES.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
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
