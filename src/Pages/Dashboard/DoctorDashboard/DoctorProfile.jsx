import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiEye, FiEyeOff } from "react-icons/fi";

// Example specialties and degrees (you can fetch from backend if you want)
const SPECIALTIES = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "Urology",
  "Gastroenterology",
  "Oncology",
  "Other",
];
const DEGREES = [
  "MBBS",
  "FCPS",
  "MD",
  "MS",
  "MRCP",
  "FRCS",
  "BCS (Health)",
  "DGO",
  "DLO",
  "Other",
];

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = localStorage.getItem("doctorId"); // <-- FIXED

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please login again.");
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
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setDoctor(data.data);
          setForm({
            ...data.data,
            specialties: data.data.specialties || [],
            degree_names: data.data.degree_names || [],
          });
        } else {
          setError("Doctor not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctor profile.");
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For multi-select specialties and degrees
  // const handleSpecialtiesChange = e => {
  //   const options = Array.from(
  //     e.target.selectedOptions,
  //     option => option.value
  //   );
  //   setForm({ ...form, specialties: options });
  // };
  const handleSpecialtiesChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(value)
        ? prev.specialties.filter((s) => s !== value)
        : [...prev.specialties, value],
    }));
  };

  // const handleDegreesChange = e => {
  //   const options = Array.from(
  //     e.target.selectedOptions,
  //     option => option.value
  //   );
  //   setForm({ ...form, degree_names: options });
  // };
  const handleDegreesChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      degree_names: prev.degree_names.includes(value)
        ? prev.degree_names.filter((d) => d !== value)
        : [...prev.degree_names, value],
    }));
  };

  // Handle profile photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // For demo, use local URL. In production, upload to S3/Cloudinary/backend and set the returned URL.
    setForm({ ...form, photo: URL.createObjectURL(file) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
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
      toast.success("Profile updated!");
    } else toast.error(data.message || "Failed to update profile.");
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
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
      toast.success("Password changed!");
    } else toast.error(data.message || "Failed to change password.");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!doctor) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-md px-6 py-8">
      <div className="flex flex-col items-center ">
        <img
          src={doctor.photo || "https://i.pravatar.cc/150"}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-purple-700 object-cover shadow"
        />
        <h2 className=" text-3xl font-bold text-purple-700">My Profile</h2>
      </div>
      {/* <h3 className="text-3xl font-bold text-purple-700 mb-2">My Profile</h3> */}
      <div className="bg-gray-50 p-4 rounded">
        {!editMode ? (
          <>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700 p-4 sm:p-6">
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
      Personal Information
    </h3>
                      <h3 className="text-2xl font-semibold text-purple-700">
                        {doctor.name}
                      </h3>
                      <p className="text-base text-gray-500">
                        {doctor.specialty ||
                          (doctor.specialties && doctor.specialties.join(", "))}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className=" text-purple-800 px-4 py-2 rounded-lg  flex items-center gap-2"
                  >
                    <FiEdit className="text-xl" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    <a
                      href={`mailto:${doctor.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {doctor.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>{" "}
                    <a
                      href={`tel:${doctor.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {doctor.phone}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Degrees:</span>{" "}
                    {doctor.degree_names && doctor.degree_names.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">BMDC No:</span>{" "}
                    {doctor.bmdc_number}
                  </div>
                  {/* <div>
        <span className="font-medium text-gray-600">Bio:</span>{' '}
        <p className="text-sm text-gray-700 mt-1">{doctor.bio}</p>
      </div> */}
                </div>
              </div>
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                <div>
                   <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest mb-1">
      Biography
    </h3>
                  <h2 className="font-semibold text-2xl text-purple-700 ">
                    About Me:
                  </h2>{" "}
                  <p className="text-sm text-gray-700 mt-1">{doctor.bio}</p>
                </div>
              </div>
              <div className="border border-purple-700 p-5 rounded-2xl shadow-md bg-white">
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-3 pt-2"
                >
                   <h3 className="text-xs text-purple-700 font-bold uppercase tracking-widest ">
      Security
    </h3>
                  <label className="block text-base font-medium text-gray-600">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700 text-xl"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSave}
            className="max-w-3xl mx-auto space-y-4 bg-white p-6 rounded-2xl shadow border border-purple-600 text-gray-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={form.photo || "https://i.ibb.co/2kR5zq0/doctor-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block text-sm text-gray-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Name"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Phone"
                required
              />
              <input
                name="bmdc_number"
                value={form.bmdc_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="BMDC Number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Main Specialty
              </label>
              <select
                name="specialty"
                value={form.specialty || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Main Specialty</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Other Specialties
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SPECIALTIES.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="specialties"
                      value={s}
                      checked={form.specialties?.includes(s)}
                      onChange={handleSpecialtiesChange}
                      className="accent-purple-600"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Degrees
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {DEGREES.map((d) => (
                  <label key={d} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="degree_names"
                      value={d}
                      checked={form.degree_names?.includes(d)}
                      onChange={handleDegreesChange}
                      className="accent-purple-600"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Write something about the doctor"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
